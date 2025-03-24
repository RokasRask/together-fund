import '../Style/listDonations.scss';

export default function ListDonations({ donations }) {
    // Funkcija datos formatavimui (nors šiame pavyzdyje datos nėra)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('lt-LT', options);
    };

    return (
        <ul className="donations-list">
            {donations.map(donation => (
                <li key={donation.id}>
                    <div className="donation-content">
                        <div className="donor-info">
                            <span className="donor">{donation.donor_name}</span>
                            {donation.created_at && (
                                <span className="date">{formatDate(donation.created_at)}</span>
                            )}
                        </div>
                        <div className="amount-container">
                            <div className="coin"></div>
                            <span className="amount">{donation.amount} €</span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}