import React from 'react';

const Erreur = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#2c3e50', // Dark background for a modern look
      color: '#ecf0f1', // Light text for contrast
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px',
    },
    heading: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    message: {
      fontSize: '1.2rem',
      marginBottom: '20px',
    },
    button: {
      backgroundColor: '#e74c3c', // Red for an error-related theme
      color: '#ecf0f1',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#c0392b', // Slightly darker red for hover effect
    },
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Erreur</h1>
      <p style={styles.message}>
        Oops! Something went wrong. Please try again or return to the homepage.
      </p>
      <button
        style={isHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => window.location.href = '/'}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default Erreur;
