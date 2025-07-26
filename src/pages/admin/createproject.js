import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJSON, postJSON } from '../../helper/api';
import ProjectFormCreate from '../../components/projectFormCreate';

// Helper to convert date string from input to ISO datetime format
function toISODateTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toISOString();
}

const ROLE_ENUM = {
  projectManagers: 1,
  translators: 2,
  editors: 3,
  uiTeam: 4,
  techTeam: 5,
  qaTeam: 6
};

const emptyProject = {
  id: 0,
  finder: '',
  heading: '',
  by: '',
  status: '',
  shortDescription: '',
  inputDate: '',
  link: '',
  type: '',
  isCarousel: false,
  translationProgress: { translate: 0, edit: 0, qa: 0, inputLastUpdated: '' },
  detail: {
    publisher: '',
    inputReleaseDate: '',
    playtime: '',
    genre: '',
    vndbLink: '',
    officialPage: '',
    fullDescription: '',
    patchSize: '',
    demoVideoUrl: '',
    staff: {
      projectManagers: [],
      translators: [],
      editors: [],
      uiTeam: [],
      techTeam: [],
      qaTeam: []
    },
    downloadDetail: {
      patchVersion: '',
      officialLink: '',
      download1: '',
      download2: '',
      download3: '',
      tutorialVideoLink: ''
    },
    patchHistory: [{ version: '', detail: '', inputReleaseDate: '' }]
  }
};

export default function AdminProjectCreate() {
  const [project, setProject] = useState(emptyProject);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState('');
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const navigate = useNavigate();

  // Fetch staff data on component mount
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
      } finally {
        setLoading(false);
      }
    }
    fetchAllStaff();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;

    // Handle thumbnail file
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

  const handleAddPatch = () => {
    setProject(prev => ({
      ...prev,
      detail: {
        ...prev.detail,
        patchHistory: [...prev.detail.patchHistory, { version: '', detail: '', inputReleaseDate: '' }]
      }
    }));
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

      const formData = new FormData();

      // Add thumbnail file if selected
      if (thumbnailFile) {
        formData.append('ThumbnailFile', thumbnailFile);
      }

      // Basic project fields
      formData.append('Finder', project.finder);
      formData.append('Heading', project.heading);
      formData.append('By', project.by);
      formData.append('Status', project.status);
      formData.append('ShortDescription', project.shortDescription);
      formData.append('Date', toISODateTime(project.inputDate));
      formData.append('Link', project.link);
      formData.append('Type', project.type);
      formData.append('IsCarousel', project.isCarousel);

      // Translation Progress
      if (project.translationProgress) {
        formData.append('TranslationProgress.Translate', parseFloat(project.translationProgress.translate) || 0);
        formData.append('TranslationProgress.Edit', parseFloat(project.translationProgress.edit) || 0);
        formData.append('TranslationProgress.QA', parseFloat(project.translationProgress.qa) || 0);
        if (project.translationProgress.inputLastUpdated) {
          formData.append('TranslationProgress.LastUpdated', toISODateTime(project.translationProgress.inputLastUpdated));
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
          });
        }
      }

      console.log("FormData entries for create:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      updateSubmissionProgress('Creating project...', 30);

      // Create the project using postJSON helper
      const result = await postJSON('/Project/createProject', formData, true);
      const projectId = result?.id || result;

      updateSubmissionProgress('Project created! Assigning staff...', 60);

      // Handle staff assignments using the separate API
      if (project.detail && project.detail.staff) {
        const staffRoles = [];
        Object.entries(project.detail.staff).forEach(([roleName, userIds]) => {
          if (Array.isArray(userIds)) {
            userIds.forEach(id => {
              if (id && String(id).trim()) {
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
          try {
            await postJSON(`/ProjectStaff/upsertStaff/${projectId}`, staffRoles);
            console.log('Staff assignment success');
          } catch (error) {
            console.error('Staff assignment error:', error);
            console.error('Failed staff data:', staffRoles);
            // Don't throw here since the project was created successfully
            console.warn('Project created but staff assignment failed');
          }
        } else {
          console.log('No staff to assign');
        }
      }

      updateSubmissionProgress('Saving patch history...', 80);

      // Handle patch history if exists
      if (project.detail && project.detail.patchHistory) {
        const validPatches = project.detail.patchHistory
          .filter(ph => ph.version && ph.detail && ph.inputReleaseDate);

        if (validPatches.length > 0) {
          const patchPayload = validPatches.map(ph => ({
            version: ph.version,
            detail: ph.detail,
            releaseDate: toISODateTime(ph.inputReleaseDate)
          }));

          try {
            await postJSON(`/PatchUpdate/upsertPatchUpdate/${projectId}`, patchPayload);
            console.log('Patch history created successfully');
          } catch (error) {
            console.error('Patch update error:', error);
            // Don't throw here since the project was created successfully
            console.warn('Project created but patch history failed to save');
          }
        }
      }

      updateSubmissionProgress('Finalizing...', 100);

      // Small delay to show completion
      setTimeout(() => {
        alert('Project created successfully!');
        navigate('/admin/list/project');
      }, 500);

    } catch (err) {
      console.error('Submit error:', err);
      alert(`Error creating project: ${err.message}`);
      setIsSubmitting(false);
      setSubmissionStep('');
      setSubmissionProgress(0);
    }
  };

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
        <div style={{ fontSize: '18px', color: '#666' }}>Loading staff data...</div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
              Creating Project...
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

      <ProjectFormCreate
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