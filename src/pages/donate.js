import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/banner';

import { getText, getJSON } from '../helper/api';

function Donate() {
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects();
  }, []);

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    userEmail: '',
    projectFinder: '',
    discordUsername: '',
    amount: ''
  });


  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Fetch project list for dropdown
  const fetchProjects = async () => {
    try {
      const data = await getJSON('/Project/sortedNineListProject');
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMessage('');

    if (!formData.userEmail || !formData.amount) {
      setResponseMessage('Email and amount are required.');
      setIsLoading(false);
      return;
    }

    let descriptionParts = [];

    if (formData.projectFinder) {
      descriptionParts.push(`PROJECT: ${formData.projectFinder}`);
    }

    if (formData.discordUsername) {
      descriptionParts.push(`DISCORD: ${formData.discordUsername}`);
    }

    const description = descriptionParts.length > 0 ? descriptionParts.join(' ').toUpperCase() : 'DONATE TO NINE TRANSLATION';

    const queryParams = new URLSearchParams({
      userEmail: formData.userEmail,
      description: description,
      amount: formData.amount
    });

    try {
      const paymentUrl = await getText(`/Donation/donate?${queryParams.toString()}`);

      if (paymentUrl && paymentUrl.includes('vnpayment.vn')) {
        const paymentWindow = window.open(
          paymentUrl,
          'vnpay_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );

        if (!paymentWindow || paymentWindow.closed || typeof paymentWindow.closed === 'undefined') {
          setResponseMessage(
            <>
              Popup blocked. Please allow popups and try again, or{' '}
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                click here to complete payment
              </a>
            </>
          );
        } else {
          setResponseMessage('Payment window opened. Please complete your payment in the new window.');
        }
      } else {
        setResponseMessage('Invalid payment URL received. Please try again.');
      }
    } catch (error) {
      console.error('Donation error:', error);
      setResponseMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App gradient-background">
      <Banner />
      <div id="main-content-container">
        <div id="main-content-wrapper">
          <div id="about-page-container">
            <div className="donate-container">
              <div className="donate-card">
                <h2 className="donate-title">Ủng hộ Nine Translation</h2>
                <p className="donate-text">
                  Cảm ơn các bạn đã đồng hành cùng Nine Translation từ những ngày đầu.
                  Sự hỗ trợ của bạn giúp chúng mình có thể mua game bản quyền và duy trì tên miền để
                  tiếp tục mang đến các bản dịch chất lượng.
                </p>

                <form className="donate-form" onSubmit={handleSubmit}>
                  <label>
                    Email của bạn <span className="required">*</span>
                    <input
                      type="email"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </label>

                  <label>
                    Donate cho dự án
                    <select
                      name="projectFinder"
                      value={formData.projectFinder}
                      onChange={handleChange}
                      disabled={isLoading || projects.length === 0}
                    >
                      <option value="">Chọn dự án...</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.finder}>{p.finder}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Discord Username
                    <input
                      type="text"
                      name="discordUsername"
                      value={formData.discordUsername}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </label>

                  <label>
                    Số tiền (VNĐ) <span className="required">*</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </label>

                  <button type="submit" className="donate-button" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Donate'}
                  </button>
                </form>

                {responseMessage && <div className="response-message">{responseMessage}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donate;
