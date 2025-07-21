import React from 'react';

function TranslationProgress({ translate, edit, QA, lastUpdated }) {
    const progressItems = [
        { label: 'Dịch', value: translate },
        { label: 'Biên dịch', value: edit },
        { label: 'Kiểm tra chất lượng', value: QA }
    ];

    return (
        <div className='progress-wrapper' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
            {progressItems.map((item, index) => (
                <div key={index} style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center', fontSize: '1.6rem', paddingBottom: '0.5rem' }}>
                        <b style={{ color: '#039dab' }}>{item.label}</b>
                    </div>
                    <div className="progress" style={{ width: '100%', position: 'relative' }}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            aria-valuenow={item.value}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: `${item.value}%`, fontSize: '1rem' }}>
                        </div>

                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)', 
                            fontSize: '1.2rem',
                            zIndex: 1, 
                            color: 'white' 
                        }}>
                            {item.value}%
                        </div>
                    </div>
                </div>
            ))}
            <div className='last-updated' style={{fontSize: '1.2rem', fontStyle: 'italic'}}>Lần cuối cập nhật: {lastUpdated}</div>
        </div>
    );
}

export default TranslationProgress;
