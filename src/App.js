import React , { useState } from 'react'; 
import './App.css';
import EuropeMap from './EuropeMap';
import Modal from './Modal'; // We will create this component next

function App() {

  // --- STATE FOR THE MODAL ---
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const openInstructionModal = () => setIsInstructionModalOpen(true);
  const closeInstructionModal = () => setIsInstructionModalOpen(false);

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  // This will be a flex container to center the floating panel
  const middleColumnWrapperStyle = {
    fontFamily: 'Times New Roman',
    flex: '2',
    display: 'flex',       // Make this a flex container
    alignItems: 'center',    // Center its child (the panel) vertically
    justifyContent: 'center' // Center its child horizontally
  };

  // NEW: Styles for the actual floating panel
  const floatingPanelStyle = {
    padding: '2rem',
    width: '90%', // Control the width of the panel within its column
    maxHeight: '90vh', // Prevents the panel from being too tall on long pages
    overflowY: 'auto', // Adds a scrollbar if content exceeds maxHeight
    // boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', // Adds a shadow for the "floating" effect
    // border: '4px solid',
    // borderColor: '#808080 #FFFFFF #FFFFFF #808080', /* top/left are dark, bottom/right are light */
    // backgroundColor: '#c3c3c3' 
  };

  // A new handler to prevent the default link action
  const handleInstructionClick = (e) => {
    e.preventDefault(); // This stops the browser from trying to follow the link
    openInstructionModal();
  };
  const handleAboutClick = (e) => {
    e.preventDefault(); // This stops the browser from trying to follow the link
    openAboutModal();
  };
  
  return (
    <>
      {/* ===== SVG NOISE FILTER DEFINITION ===== */}
      <svg style={{ display: 'none' }}>
        <filter id="grainy">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="30"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div className="animated-background" style={{ display: 'flex', minHeight: '100vh'}}>
        <div style={{ flex: '1', padding: '1rem'}}>
          {/* <h2>Left Sidebar</h2>
          <p>This is the left column.</p> */}
        </div>
        <div style={middleColumnWrapperStyle}>
          <main className="main-content-retro" style={floatingPanelStyle}>
            <div class="flex-container-auto-margin" style={{
                height: '25px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
              <h1>An Unreliable Atlas</h1>
              <div class="push-right">
                <a
                  href="#" // href is needed for it to be treated as a link
                  className="retro-link"
                  onClick={handleInstructionClick} // Use the new handler
                  style={{ marginLeft: '15px', display: 'inline-block', marginTop: '10px' }}
                >
                  How does it work?
                </a>
              </div>
            </div>
            <EuropeMap />
            <div style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <a
                href="#" // href is needed for it to be treated as a link
                className="retro-link"
                onClick={handleAboutClick} // Use the new handler
                style={{ marginLeft: '15px', display: 'inline-block', marginTop: '10px' }}
              >
                about
              </a>
            </div>
          </main>
        </div>
        <div style={{ flex: '1', padding: '1rem'}}>
          {/* <h2>Right Sidebar</h2>
          <p>This is the right column.</p> */}
        </div>

        {/* --- RENDER THE MODAL COMPONENT --- */}
        <Modal isOpen={isInstructionModalOpen} onClose={closeInstructionModal}>
          <h2>How does it work?</h2>
          <p>1. The general process of visualizing geographic data involves acquiring information, then plotted said data onto a map, which provides geographical context & insight.</p>
          <p>2. We do not do that here.</p>
          <p>3. Select any country, create the visualization first.</p>
          <p>4. Then see what kind of data that your visualiarion can come from.</p>
          <button className="retro-button" onClick={closeInstructionModal} style={{ marginTop: '20px' }}>
            OK
          </button>
        </Modal>
        <Modal isOpen={isAboutModalOpen} onClose={closeAboutModal}>
          <h2>About this Project</h2>
          <p>This project is a part of <i>PU Visualization Playground 2025</i>, inspired purely by the question, "Can I reverse the process of visualization?" without ever considering the usefulness of the result.</p>
          <p>This project's format is highly experimental; it might come out as disorganized, disorienting, or borderline schizophrenic. I DO NOT CARE.</p>
          <p>Users should proceed with caution. Consultation with a professional geologist, historian, or any form of fact-checking may result in discrepancies between the information and reality, which could lead to questioning one's life decisions or spiraling into existential dread.</p>
          <p>The creator and any involved parties will not be held responsible for any physical, mental, or metaphorical damage, including injury or any form of death, that may or may not be caused by this website.</p>
          <button className="retro-button" onClick={closeAboutModal} style={{ marginTop: '20px' }}>
            I accept
          </button>
        </Modal>

      </div>
    </>
  );
}

export default App;
