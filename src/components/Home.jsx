import React from 'react';

const Home = () => {
  return (
    <>
      <div className="background-video w-embed" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '-1' }}>
        <video
          id="video"
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
          autoPlay
          muted
          loop
          src="https://bb-website-public-assets.s3.ap-south-1.amazonaws.com/Videos/Home+Video+Short.mp4"
        />

        {/* Overlay Text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#eb2f06',
            textAlign: 'center',
            fontSize: '7rem',
            fontWeight: '400px',
          }}
        >
          <br />
          
        </div>
      </div>
    </>
  );
};

export default Home;
