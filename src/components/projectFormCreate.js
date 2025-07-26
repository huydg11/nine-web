// src/components/admin/ProjectForm.jsx
import React, { useEffect, useState } from 'react';

function ProjectFormCreate({
    project,
    allStaff,
    thumbnailFile,
    handleChange,
    handleSubmit,
    handleAddPatch,
    setThumbnailFile
}) {
    const ROLE_ENUM = {
        projectManagers: 1,
        translators: 2,
        editors: 3,
        uiTeam: 4,
        techTeam: 5,
        qaTeam: 6
    };

    if (!project) return null;

    const [addingRole, setAddingRole] = useState(null);
    const [newStaffSelection, setNewStaffSelection] = useState('');

    // Normalize IDs to strings for comparison
    const normalizeId = id => String(id);

    // Helper function to remove staff member
    const handleRemoveStaff = (role, userIdToRemove) => {
        const updatedMembers = project.detail.staff[role].filter(
            userId => normalizeId(userId) !== normalizeId(userIdToRemove)
        );
        handleChange({
            target: {
                name: `Detail.Staff.${role}`,
                value: updatedMembers
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <h1 className="heading">Edit Project: {project.heading}</h1>

            {/* Basic Info */}
            <div>
                <fieldset className="fieldset">
                    <legend className="legend">Content Details</legend>
                    <label className="label">
                        Heading:
                        <input
                            className="input"
                            name="heading"
                            value={project.heading || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Finder:
                        <input
                            className="input"
                            name="finder"
                            value={project.finder || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        By:
                        <input
                            className="input"
                            name="by"
                            value={project.by || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Type:
                        <input
                            className="input"
                            name="type"
                            value={project.type || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Status:
                        <input
                            className="input"
                            name="status"
                            value={project.status || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Short Description:
                        <textarea
                            className="textarea"
                            name="shortDescription"
                            value={project.shortDescription || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Full Description:
                        <textarea
                            className="textarea"
                            name="Detail.fullDescription"
                            value={project.detail.fullDescription || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Link:
                        <input
                            className="input"
                            name="link"
                            value={project.link || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Date:
                        <input
                            className="input"
                            type="date"
                            name="inputDate"
                            value={project.inputDate || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Is Carousel:
                        <input
                            type="checkbox"
                            name="isCarousel"
                            checked={project.isCarousel || false}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Thumbnail:
                        <input
                            type="file"
                            name="ThumbnailFile"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {thumbnailFile && (
                            <div style={{ marginTop: '8px' }}>
                                <p style={{ fontSize: '12px', color: '#666' }}>
                                    Selected: {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(1)} KB)
                                </p>
                            </div>
                        )}
                        {project.thumbnail && (
                            <div style={{ marginTop: '8px' }}>
                                <img
                                    src={project.thumbnail}
                                    alt="Current thumbnail"
                                    style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                    Current thumbnail
                                </p>
                            </div>
                        )}
                    </label>
                </fieldset>
            </div>

            {/* Translation Progress */}
            {project.translationProgress && (
                <fieldset className="fieldset">
                    <legend className="legend">Translation Progress</legend>
                    <label className="label">
                        Translate:
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            name="TranslationProgress.translate"
                            value={project.translationProgress.translate || 0}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Edit:
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            name="TranslationProgress.edit"
                            value={project.translationProgress.edit || 0}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        QA:
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            name="TranslationProgress.qa"
                            value={project.translationProgress.qa || 0}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Last Updated:
                        <input
                            className="input"
                            type="date"
                            name="TranslationProgress.inputLastUpdated"
                            value={project.translationProgress.inputLastUpdated || ''}
                            onChange={handleChange}
                        />
                    </label>
                </fieldset>
            )}

            {/* Detail Section */}
            {project.detail && (
                <fieldset className="fieldset">
                    <legend className="legend">Detail</legend>
                    <label className="label">
                        Publisher:
                        <input
                            className="input"
                            name="Detail.publisher"
                            value={project.detail.publisher || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Release Date:
                        <input
                            className="input"
                            type="date"
                            name="Detail.inputReleaseDate"
                            value={project.detail.inputReleaseDate || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Playtime:
                        <input
                            className="input"
                            name="Detail.playtime"
                            value={project.detail.playtime || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Genre:
                        <input
                            className="input"
                            name="Detail.genre"
                            value={project.detail.genre || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        VNDB Link:
                        <input
                            className="input"
                            name="Detail.vndbLink"
                            value={project.detail.vndbLink || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Official Page:
                        <input
                            className="input"
                            name="Detail.officialPage"
                            value={project.detail.officialPage || ''}
                            onChange={handleChange}
                        />
                    </label>
                </fieldset>
            )}

            {/* Download Details Section */}
            {project.detail && project.detail.downloadDetail && (
                <fieldset className="fieldset">
                    <legend className="legend">Download Details</legend>
                    <label className="label">
                        Patch Version:
                        <input
                            className="input"
                            name="Detail.DownloadDetail.patchVersion"
                            value={project.detail.downloadDetail.patchVersion || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Official Link:
                        <input
                            className="input"
                            name="Detail.DownloadDetail.officialLink"
                            value={project.detail.downloadDetail.officialLink || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Download 1:
                        <input
                            className="input"
                            name="Detail.DownloadDetail.download1"
                            value={project.detail.downloadDetail.download1 || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Download 2:
                        <input
                            className="input"
                            name="Detail.DownloadDetail.download2"
                            value={project.detail.downloadDetail.download2 || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Download 3:
                        <input
                            className="input"
                            name="Detail.DownloadDetail.download3"
                            value={project.detail.downloadDetail.download3 || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Tutorial Video Link:
                        <input
                            className="input"
                            name="Detail.DownloadDetail.tutorialVideoLink"
                            value={project.detail.downloadDetail.tutorialVideoLink || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Patch Size:
                        <input
                            className="input"
                            name="Detail.patchSize"
                            value={project.detail.patchSize || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="label">
                        Demo Video URL:
                        <input
                            className="input"
                            name="Detail.demoVideoUrl"
                            value={project.detail.demoVideoUrl || ''}
                            onChange={handleChange}
                        />
                    </label>
                </fieldset>
            )}

            {/* Staff Section */}
            {project.detail.staff && Object.entries(project.detail.staff).map(([role, members]) => (
                <fieldset key={role} className="fieldset">
                    <legend className="legend">{role.charAt(0).toUpperCase() + role.slice(1)}</legend>
                    
                    {/* Current Staff Members */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {members && members.length > 0 ? (
                            members.map(userId => {
                                const user = allStaff.find(u => normalizeId(u.id) === normalizeId(userId));
                                return user ? (
                                    <div key={userId} className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded">
                                        <span>{user.displayName}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStaff(role, userId)}
                                            className="ml-1 text-red-600 hover:text-red-800 font-bold"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <span key={userId} className="px-2 py-1 bg-red-200 rounded">
                                        Unknown User ({userId})
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStaff(role, userId)}
                                            className="ml-1 text-red-600 hover:text-red-800 font-bold"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            })
                        ) : (
                            <span className="text-gray-500 italic">No staff assigned</span>
                        )}
                    </div>

                    {/* Add Staff UI */}
                    {addingRole === role ? (
                        <div className="flex items-center gap-2 mt-2">
                            <select
                                className="input"
                                value={newStaffSelection}
                                onChange={e => setNewStaffSelection(e.target.value)}
                            >
                                <option value="">-- Select staff --</option>
                                {allStaff
                                    .filter(u => u.isActive && !members.some(memberId => normalizeId(memberId) === normalizeId(u.id)))
                                    .map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.displayName} ({u.email})
                                        </option>
                                    ))}
                            </select>
                            <button
                                type="button"
                                className="button"
                                onClick={() => {
                                    if (newStaffSelection) {
                                        handleChange({
                                            target: {
                                                name: `Detail.Staff.${role}`,
                                                value: [...(members || []), newStaffSelection]
                                            }
                                        });
                                    }
                                    setAddingRole(null);
                                    setNewStaffSelection('');
                                }}
                                disabled={!newStaffSelection}
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                className="button"
                                onClick={() => {
                                    setAddingRole(null);
                                    setNewStaffSelection('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="button mt-2"
                            onClick={() => setAddingRole(role)}
                        >
                            + Add {role}
                        </button>
                    )}
                </fieldset>
            ))}

            {/* Patch History Section */}
            {project.detail && project.detail.patchHistory && (
                <fieldset className="fieldset">
                    <legend className="legend">Patch History</legend>

                    <button
                        type="button"
                        onClick={handleAddPatch}
                        className="button"
                        style={{ marginTop: '10px' }}
                    >
                        + Add Patch
                    </button>

                    {project.detail.patchHistory.map((ph, idx) => (
                        <div key={idx} style={{ marginBottom: '16px', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }}>
                            <h4>Patch {idx + 1}</h4>
                            <label className="label">
                                Version:
                                <input
                                    className="input"
                                    name={`Detail.PatchHistory[${idx}].version`}
                                    value={ph.version || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="label">
                                Detail:
                                <textarea
                                    className="textarea"
                                    name={`Detail.PatchHistory[${idx}].detail`}
                                    value={ph.detail || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="label">
                                Release Date:
                                <input
                                    className="input"
                                    type="date"
                                    name={`Detail.PatchHistory[${idx}].inputReleaseDate`}
                                    value={ph.inputReleaseDate || ''}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    ))}
                </fieldset>
            )}

            <button type="submit" className="button">Update Project</button>
        </form>
    );
}

export default ProjectFormCreate;