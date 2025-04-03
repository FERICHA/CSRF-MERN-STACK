import React from 'react';
import FormComponent from './components/FormComponent';


function App() {
  return (
    <div className="app-container">
      <h1>Interface Client avec Protection CSRF</h1>
      <FormComponent />
    </div>
  );
}

export default App;