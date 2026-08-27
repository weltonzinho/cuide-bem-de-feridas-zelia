import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { Dashboard } from './components/Dashboard';
import { SmartScheduler } from './components/Scheduling/SmartScheduler';
import { PatientList } from './components/Patients/PatientList';
import { WoundEvolutionGallery } from './components/WoundGallery/WoundEvolutionGallery';
import { SupplyStockManager } from './components/Supplies/SupplyStockManager';
import { ReportsModule } from './components/Reports/ReportsModule';
import { PatientPortal } from './components/PatientPortal/PatientPortal';
import { NurseProfileManager } from './components/NurseProfile/NurseProfileManager';
import { NurseAuthLockModal } from './components/NurseProfile/NurseAuthLockModal';
import { EvolutionFormModal } from './components/Evolution/EvolutionFormModal';
import { AppointmentModal } from './components/Scheduling/AppointmentModal';
import { AIAdvisorModal } from './components/Evolution/AIAdvisorModal';
import { LoginPortal } from './components/Auth/LoginPortal';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    userRole,
    activeSession,
    isLoginPortalOpen,
    setIsLoginPortalOpen,
    isEvolutionModalOpen, 
    setIsEvolutionModalOpen,
    isAppointmentModalOpen, 
    setIsAppointmentModalOpen,
    isAIAdvisorModalOpen, 
    setIsAIAdvisorModalOpen,
    selectedPatient,
    selectedWound
  } = useApp();

  // If there is no active session at all and portal is not dismissed, show standalone login screen
  if (!activeSession) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white antialiased">
        <LoginPortal isStandaloneScreen={true} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white antialiased">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {userRole === 'patient' || activeTab === 'patient_portal' ? (
          <PatientPortal />
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'scheduler' && <SmartScheduler />}
            {activeTab === 'patients' && <PatientList />}
            {activeTab === 'gallery' && <WoundEvolutionGallery />}
            {activeTab === 'supplies' && <SupplyStockManager />}
            {activeTab === 'reports' && <ReportsModule />}
            {activeTab === 'nurse_profile' && <NurseProfileManager />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-slate-800/80 py-5 px-6 text-center text-xs text-slate-400 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-md flex items-center justify-center font-bold text-[10px] border border-blue-500/30">
              CB
            </div>
            <span>
              <strong className="text-white">Cuide Bem de Feridas</strong> &copy; {new Date().getFullYear()} • Plataforma Especializada em Estomaterapia
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">
            Conforme normativas COFEN e escala PUSH Tool de cicatrização
          </span>
        </div>
      </footer>

      {/* Login Portal Modal (when opened from navbar or switch account) */}
      {isLoginPortalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <LoginPortal 
              initialRole={userRole} 
              onClose={() => setIsLoginPortalOpen(false)} 
              isStandaloneScreen={false} 
            />
          </div>
        </div>
      )}

      {/* Global Clinical Evolution Modal */}
      {isEvolutionModalOpen && (
        <EvolutionFormModal
          patient={selectedPatient || undefined}
          wound={selectedWound || undefined}
          onClose={() => setIsEvolutionModalOpen(false)}
        />
      )}

      {/* Global Appointment Booking Modal */}
      {isAppointmentModalOpen && (
        <AppointmentModal
          onClose={() => setIsAppointmentModalOpen(false)}
        />
      )}

      {/* Global AI Clinical Advisor Modal */}
      {isAIAdvisorModalOpen && (
        <AIAdvisorModal
          onClose={() => setIsAIAdvisorModalOpen(false)}
        />
      )}

      {/* Global Nurse Authentication & Lock Screen */}
      <NurseAuthLockModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
