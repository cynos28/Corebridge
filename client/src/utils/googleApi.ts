// utils/googleApi.ts

// Extend the Window interface to include gapi
declare global {
    interface Window {
      gapi: any;
    }
  }
  
  // No need for a separate file with initialization functions since we're 
  // handling the Google API initialization directly in the Schedule component