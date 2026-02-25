import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import Step1Specialty from '@/components/Step1Specialty';
import Step2Interventions from '@/components/Step2Interventions';
import Step3Patient from '@/components/Step3Patient';
import Step4Result from '@/components/Step4Result';
import QuoteModal from '@/components/QuoteModal';
import { type SelectedIntervention, type PatientInfo, type CalculResult, REGIMES, calculateResult } from '@/data/medical-data';

const initialPatient: PatientInfo = {
  nom: '',
  numSecu: '',
  regime: '',
  mutuelle: '',
  tauxMutuelle: 0,
};

const Index = () => {
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState('');
  const [interventions, setInterventions] = useState<SelectedIntervention[]>([]);
  const [patient, setPatient] = useState<PatientInfo>(initialPatient);
  const [result, setResult] = useState<CalculResult | null>(null);
  const [showQuote, setShowQuote] = useState(false);

  const handleCalculate = useCallback(() => {
    const regime = REGIMES.find((r) => r.value === patient.regime);
    const regimeTaux = regime?.taux ?? 0.7;
    const calc = calculateResult(interventions, regimeTaux, patient.tauxMutuelle);
    setResult(calc);
    setStep(4);
  }, [interventions, patient]);

  const handleReset = () => {
    setStep(1);
    setSpecialty('');
    setInterventions([]);
    setPatient(initialPatient);
    setResult(null);
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        <ProgressBar currentStep={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Specialty
              key="step1"
              selected={specialty}
              onSelect={setSpecialty}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2Interventions
              key="step2"
              specialtyId={specialty}
              interventions={interventions}
              setInterventions={setInterventions}
              onPrev={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3Patient
              key="step3"
              patient={patient}
              setPatient={setPatient}
              onPrev={() => setStep(2)}
              onNext={handleCalculate}
            />
          )}
          {step === 4 && result && (
            <Step4Result
              key="step4"
              patient={patient}
              interventions={interventions}
              result={result}
              onPrev={() => setStep(3)}
              onReset={handleReset}
              onGenerateQuote={() => setShowQuote(true)}
            />
          )}
        </AnimatePresence>

        {showQuote && result && (
          <QuoteModal
            patient={patient}
            interventions={interventions}
            result={result}
            onClose={() => setShowQuote(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
