import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getJSON } from '../../helper/api';
import { postJSON } from '../../helper/api';
import ProjectForm from '../../components/projectForm';

// Helper to convert "Thứ ..., DD/MM/YYYY" to "YYYY-MM-DD" format for input[type="date"]
function parseVNDateToInputDate(vnDateStr) {
    if (!vnDateStr) return '';
    const match = vnDateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (!match) return '';
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
}

// Convert date string from input to ISO datetime format
function toISODateTime(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toISOString();
}

// Define role mapping
const ROLE_ENUM = {
    projectManagers: 1,
    translators: 2,
    editors: 3,
    uiTeam: 4,
    techTeam: 5,
    qaTeam: 6
};

// Helper function to convert linkedStaff to staff object
function processLinkedStaffToStaff(linkedStaff) {
    const staff = {
        projectManagers: [],
        translators: [],
        editors: [],
        uiTeam: [],
        techTeam: [],
        qaTeam: []
    };

    if (linkedStaff && Array.isArray(linkedStaff)) {
        linkedStaff.forEach(staffMember => {
            const roleKey = Object.keys(ROLE_ENUM).find(key => ROLE_ENUM[key] === staffMember.role);
            if (roleKey && staffMember.userId) {
                staff[roleKey].push(String(staffMember.userId));
            }
        });
    }

    return staff;
}

function AdminProjectDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [allStaff, setAllStaff] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStep, setSubmissionStep] = useState('');
    const [submissionProgress, setSubmissionProgress] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const segments = location.pathname.split('/');
        const finder = segments[segments.length - 1];

        async function fetchDetail() {
            try {
                const data = await getJSON(`/Project/${finder}`);
                console.log('Raw project data from API:', data);

                data.inputDate = parseVNDateToInputDate(data.date);

                if (data.translationProgress) {
                    data.translationProgress.inputLastUpdated = parseVNDateToInputDate(data.translationProgress.lastUpdated);
                }

                if (data.detail) {
                    data.detail.inputReleaseDate = parseVNDateToInputDate(data.detail.releaseDate);

                    if (data.detail.patchHistory) {
                        data.detail.patchHistory = data.detail.patchHistory.map(ph => ({
                            ...ph,
                            inputReleaseDate: parseVNDateToInputDate(ph.releaseDate)
                        }));
                    }

                    // Log the original staff data structure
                    console.log('Original staff data from project:', data.detail.staff);
                    console.log('LinkedStaff data from project:', data.detail.linkedStaff);

                    // Process linkedStaff to create proper staff object
                    if (data.detail.linkedStaff && Array.isArray(data.detail.linkedStaff)) {
                        data.detail.staff = processLinkedStaffToStaff(data.detail.linkedStaff);
                        console.log('Processed staff from linkedStaff:', data.detail.staff);
                    } else {
                        // Ensure staff object exists and has proper structure
                        if (!data.detail.staff) {
                            data.detail.staff = {
                                projectManagers: [],
                                translators: [],
                                editors: [],
                                uiTeam: [],
                                techTeam: [],
                                qaTeam: []
                            };
                        } else {
                            // Ensure all staff arrays exist and normalize IDs to strings
                            Object.keys(ROLE_ENUM).forEach(role => {
                                if (!data.detail.staff[role]) {
                                    data.detail.staff[role] = [];
                                } else {
                                    // Filter out invalid entries like "string" and normalize valid IDs
                                    data.detail.staff[role] = data.detail.staff[role]
                                        .filter(id => id && id !== 'string' && String(id).trim() !== '')
                                        .map(id => String(id));
                                }
                            });
                        }
                    }

                    console.log('Final processed staff data:', data.detail.staff);
                }

                setProject(data);
            } catch (err) {
                console.error('Error loading detail:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [location.pathname]);

    useEffect(() => {
        async function fetchAllStaff() {
            try {
                const staff = await getJSON('/Admin/getStaff');
                console.log('Raw staff data from API:', staff);
                // Ensure all staff IDs are strings for consistent comparison
                const normalizedStaff = staff.map(s => ({
                    ...s,
                    id: String(s.id)
                }));
                console.log('Normalized staff data:', normalizedStaff);
                setAllStaff(normalizedStaff);
            } catch (e) {
                console.error('Failed to load staff list', e);
            }
        }
        fetchAllStaff();
    }, []);

    const handleChange = e => {
        const { name, value, type, checked, files } = e.target;
        if (name === 'ThumbnailFile' && files && files[0]) {
            setThumbnailFile(files[0]);
            return;
        }
        const val = type === 'checkbox' ? checked : value;

        setProject(prev => {
            const copy = { ...prev };
            if (name.includes('.')) {
                const parts = name.split('.');

                if (parts[0] === 'TranslationProgress') {
                    copy.translationProgress[parts[1]] = val;
                } else if (parts[0] === 'Detail') {
                    if (name.includes('PatchHistory[')) {
                        const match = name.match(/PatchHistory\[(\d+)\]\.(.+)/);
                        if (match) {
                            const [, arrIdx, field] = match;
                            if (!copy.detail.patchHistory[+arrIdx]) {
                                copy.detail.patchHistory[+arrIdx] = {};
                            }
                            copy.detail.patchHistory[+arrIdx][field] = val;
                        }
                    } else if (parts[1] === 'Staff') {
                        const role = parts[2];
                        if (role) {
                            // Ensure we're working with string IDs
                            const normalizedVal = Array.isArray(val)
                                ? val.map(id => String(id))
                                : val.split(',').map(s => String(s.trim())).filter(s => s);
                            copy.detail.staff[role] = normalizedVal;
                        }
                    } else if (parts[1] === 'DownloadDetail') {
                        const key = parts[2];
                        if (!copy.detail.downloadDetail) copy.detail.downloadDetail = {};
                        copy.detail.downloadDetail[key] = val;
                    } else {
                        copy.detail[parts[1]] = val;
                    }
                }
            } else {
                copy[name] = val;
            }
            return copy;
        });
    };

    const updateSubmissionProgress = (step, progress) => {
        setSubmissionStep(step);
        setSubmissionProgress(progress);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            updateSubmissionProgress('Preparing project data...', 10);

            const stripHtml = html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                return doc.body.textContent || '';
            };
            const plainText = stripHtml(project.detail.fullDescription);
            const shortDesc = plainText.slice(0, 220);

            let link = project.type === 'project'
                ? `/project/nine/${project.finder}`
                : `/post/${project.finder}`;

            const formData = new FormData();
            if (thumbnailFile) formData.append('ThumbnailFile', thumbnailFile);


            // Add all other fields
            formData.append('Id', project.id);
            formData.append('Finder', project.finder);
            formData.append('Heading', project.heading);
            formData.append('By', project.by);
            formData.append('Status', project.status);
            formData.append('ShortDescription', shortDesc);
            formData.append('Date', toISODateTime(project.inputDate));
            formData.append('Link', link);
            formData.append('Type', project.type);
            formData.append('IsCarousel', project.isCarousel);


            if (project.type === 'post') {
                
            } else {
                formData.append('Date', toISODateTime(project.inputDate));
                if (project.translationProgress) {
                    formData.append(
                        'TranslationProgress.Translate',
                        parseFloat(project.translationProgress.translate) || 0
                    );
                    formData.append(
                        'TranslationProgress.Edit',
                        parseFloat(project.translationProgress.edit) || 0
                    );
                    formData.append(
                        'TranslationProgress.QA',
                        parseFloat(project.translationProgress.qa) || 0
                    );
                    if (project.translationProgress.inputLastUpdated) {
                        formData.append(
                            'TranslationProgress.LastUpdated',
                            toISODateTime(project.translationProgress.inputLastUpdated)
                        );
                    }
                }
            }


            // Detail fields
            if (project.detail) {
                formData.append('Detail.Publisher', project.detail.publisher || '');
                if (project.detail.inputReleaseDate) {
                    formData.append('Detail.ReleaseDate', toISODateTime(project.detail.inputReleaseDate));
                }
                formData.append('Detail.Playtime', project.detail.playtime || '');
                formData.append('Detail.Genre', project.detail.genre || '');
                formData.append('Detail.VndbLink', project.detail.vndbLink || '');
                formData.append('Detail.OfficialPage', project.detail.officialPage || '');
                formData.append('Detail.FullDescription', project.detail.fullDescription || '');
                formData.append('Detail.PatchSize', project.detail.patchSize || '');
                formData.append('Detail.DemoVideoUrl', project.detail.demoVideoUrl || '');

                // Download Detail
                if (project.detail.downloadDetail) {
                    formData.append('Detail.DownloadDetail.PatchVersion', project.detail.downloadDetail.patchVersion || '');
                    formData.append('Detail.DownloadDetail.OfficialLink', project.detail.downloadDetail.officialLink || '');
                    formData.append('Detail.DownloadDetail.Download1', project.detail.downloadDetail.download1 || '');
                    formData.append('Detail.DownloadDetail.Download2', project.detail.downloadDetail.download2 || '');
                    formData.append('Detail.DownloadDetail.Download3', project.detail.downloadDetail.download3 || '');
                    formData.append('Detail.DownloadDetail.TutorialVideoLink', project.detail.downloadDetail.tutorialVideoLink || '');
                }

                // Patch History
                if (project.detail.patchHistory) {
                    const patchHistory = project.detail.patchHistory.filter(ph => ph && (ph.version || ph.detail || ph.inputReleaseDate));
                    patchHistory.forEach((ph, index) => {
                        formData.append(`Detail.PatchHistory[${index}].version`, ph.version || '');
                        formData.append(`Detail.PatchHistory[${index}].detail`, ph.detail || '');
                        if (ph.inputReleaseDate) {
                            formData.append(`Detail.PatchHistory[${index}].releaseDate`, toISODateTime(ph.inputReleaseDate));
                        }
                        formData.append(`Detail.PatchHistory[${index}].projectDetailId`, ph.projectDetailId || 0);
                    });
                }
            }

            console.log("FormData entries:");
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            updateSubmissionProgress('Updating project...', 30);

            // Update the main project data using generic API utility
            const result = await postJSON('/Project/update', formData, true);
            console.log('Project update success:', result);

            updateSubmissionProgress('Updating staff assignments...', 60);

            // Update staff assignments using the separate API
            if (project.detail && project.detail.staff) {
                const staffRoles = [];
                Object.entries(project.detail.staff).forEach(([roleName, userIds]) => {
                    if (Array.isArray(userIds)) {
                        userIds.forEach(id => {
                            if (id && String(id).trim() && id !== 'string') {
                                staffRoles.push({
                                    userId: String(id).trim(),
                                    role: ROLE_ENUM[roleName] || 0
                                });
                            }
                        });
                    }
                });

                console.log('All staff data:', allStaff);
                console.log('Project staff data:', project.detail.staff);
                console.log('Staff roles being sent to API:', staffRoles);

                if (staffRoles.length > 0) {
                    await postJSON(`/ProjectStaff/upsertStaff/${project.id}`, staffRoles);
                    console.log('Staff update success');
                } else {
                    console.log('No staff to update');
                }
            }

            updateSubmissionProgress('Updating patch history...', 80);

            // Update patch history if exists
            if (project.detail && project.detail.patchHistory) {
                await upsertPatchUpdates(project.id, project.detail.patchHistory);
            }

            updateSubmissionProgress('Finalizing...', 100);

            // Small delay to show completion
            setTimeout(() => {
                alert('Project updated successfully!');
                navigate('/admin/list/project');
            }, 500);

        } catch (err) {
            console.error('Submit error:', err);
            alert(`Error updating project: ${err.message}`);
            setIsSubmitting(false);
            setSubmissionStep('');
            setSubmissionProgress(0);
        }
    };

    async function upsertPatchUpdates(projectId, patchHistory) {
        try {
            const validPatches = patchHistory
                .filter(ph => ph.version && ph.detail && ph.inputReleaseDate);

            if (validPatches.length === 0) return;

            const patchData = validPatches.map(ph => ({
                version: ph.version,
                detail: ph.detail,
                releaseDate: toISODateTime(ph.inputReleaseDate)
            }));

            await postJSON(`/PatchUpdate/upsertPatchUpdate/${projectId}`, patchData);
            console.log('Patch update success');
        } catch (error) {
            console.error('Patch update error:', error);
            alert('Patch update failed: ' + error.message);
        }
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                gap: '20px'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <div style={{ fontSize: '18px', color: '#666' }}>Loading project data...</div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{
                textAlign: 'center',
                marginTop: '50px',
                color: 'red',
                fontSize: '18px'
            }}>
                Error loading project.
            </div>
        );
    }

    const handleAddPatch = () => {
        setProject(prev => {
            const newPatch = {
                version: '',
                detail: '',
                inputReleaseDate: ''
            };

            return {
                ...prev,
                detail: {
                    ...prev.detail,
                    patchHistory: [...(prev.detail.patchHistory || []), newPatch]
                }
            };
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Loading Overlay */}
            {isSubmitting && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    color: 'white'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                        textAlign: 'center',
                        minWidth: '300px',
                        color: '#333'
                    }}>
                        {/* Animated spinner */}
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px auto'
                        }}></div>

                        {/* Progress bar */}
                        <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                width: `${submissionProgress}%`,
                                height: '100%',
                                backgroundColor: '#3498db',
                                transition: 'width 0.3s ease',
                                borderRadius: '4px'
                            }}></div>
                        </div>

                        {/* Status text */}
                        <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            Updating Project...
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: '#666'
                        }}>
                            {submissionStep}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: '#999',
                            marginTop: '10px'
                        }}>
                            {submissionProgress}% Complete
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <ProjectForm
                project={project}
                allStaff={allStaff}
                thumbnailFile={thumbnailFile}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleAddPatch={handleAddPatch}
                setThumbnailFile={setThumbnailFile}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

export default AdminProjectDetail;