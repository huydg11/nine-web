import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getJSON, postJSON } from '../../helper/api';
import AccountForm from '../../components/AccountForm';

function UpdateAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.pathname.split('/').pop();

    const [formData, setFormData] = useState({
        id: '',
        email: '',
        password: '',
        displayName: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getJSON(`/Admin/getStaffById/${id}`);
            setFormData({
                id: data.id,
                email: data.email,
                password: '',
                displayName: data.displayName
            });
        } catch (error) {
            console.error('Failed to load staff:', error);
            alert('Error loading staff data');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const updateData = new FormData();
            updateData.append('Id', formData.id);
            updateData.append('Email', formData.email);
            updateData.append('DisplayName', formData.displayName);
            updateData.append('NewPassword', formData.password); // may be empty

            await postJSON('/Admin/updateAccount', updateData, true);

            alert('Account updated successfully!');
            navigate('/admin/account');
        } catch (error) {
            console.error('Update error:', error);
            alert(`Error updating account: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="App gradient-background">
            <AccountForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isUpdate={true}
            />
        </div>
    );
}

export default UpdateAccount;
