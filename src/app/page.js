import ResumeUpload from './components/ResumeUpload';

export default function Home() {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">AI-Powered Portfolio Builder</h1>
        <p className="text-lg text-gray-300 mb-4 text-center">Upload your resume and generate a stunning portfolio instantly.</p>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl flex">
          <ResumeUpload/>
        </div>
      </div>
    );
  }
  