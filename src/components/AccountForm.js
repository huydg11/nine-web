// components/AccountForm.js
import React from 'react';

function AccountForm({ formData, errors, isSubmitting, handleChange, handleSubmit, isUpdate }) {
    return (
        <form onSubmit={handleSubmit} className="container">
            <h1 className="heading">{isUpdate ? 'Update Account' : 'Create New Account'}</h1>

            <fieldset className="fieldset">
                <legend className="legend">Account Details</legend>

                <label className="label">
                    Email:
                    <input
                        className="input"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </label>

                <label className="label">
                    Display Name:
                    <input
                        className="input"
                        name="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={handleChange}
                        required
                    />
                    {errors.displayName && <span className="error">{errors.displayName}</span>}
                </label>

                <label className="label">
                    {isUpdate ? 'New Password' : 'Password'}:
                    <input
                        className="input"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isUpdate}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </label>

                {!isUpdate && (
                    <label className="label">
                        Confirm Password:
                        <input
                            className="input"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </label>
                )}
            </fieldset>

            <button type="submit" className="button" disabled={isSubmitting}>
                {isSubmitting ? (isUpdate ? 'Updating...' : 'Creating...') : (isUpdate ? 'Update Account' : 'Create Account')}
            </button>
        </form>
    );
}

export default AccountForm;
