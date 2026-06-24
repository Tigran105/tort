import { create } from 'zustand';
import {
  BUILDER_STEPS,
  type BuilderContact,
  type BuilderSelections,
  type BuilderStep,
} from '@/types';

interface CakeBuilderState {
  currentStep: BuilderStep;
  selections: BuilderSelections;
  contact: BuilderContact;
  setStep: (step: BuilderStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTierId: (tierId: string | null) => void;
  setSizeId: (sizeId: string | null) => void;
  setFillingId: (fillingId: string | null) => void;
  setFruitId: (fruitId: string | null) => void;
  setNutId: (nutId: string | null) => void;
  setContact: (contact: Partial<BuilderContact>) => void;
  resetBuilder: () => void;
}

const initialSelections: BuilderSelections = {
  tierId: null,
  sizeId: null,
  fillingId: null,
  fruitId: null,
  nutId: null,
};

const initialContact: BuilderContact = {
  name: '',
  phone: '',
  email: '',
  deliveryDate: '',
  notes: '',
};

export const useCakeBuilderStore = create<CakeBuilderState>((set, get) => ({
  currentStep: 'tier',
  selections: initialSelections,
  contact: initialContact,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => {
    const currentIndex = BUILDER_STEPS.indexOf(get().currentStep);
    if (currentIndex < BUILDER_STEPS.length - 1) {
      set({ currentStep: BUILDER_STEPS[currentIndex + 1] });
    }
  },
  prevStep: () => {
    const currentIndex = BUILDER_STEPS.indexOf(get().currentStep);
    if (currentIndex > 0) {
      set({ currentStep: BUILDER_STEPS[currentIndex - 1] });
    }
  },
  setTierId: (tierId) =>
    set((state) => ({
      selections: { ...state.selections, tierId },
    })),
  setSizeId: (sizeId) =>
    set((state) => ({
      selections: { ...state.selections, sizeId },
    })),
  setFillingId: (fillingId) =>
    set((state) => ({
      selections: { ...state.selections, fillingId },
    })),
  setFruitId: (fruitId) =>
    set((state) => ({
      selections: { ...state.selections, fruitId },
    })),
  setNutId: (nutId) =>
    set((state) => ({
      selections: { ...state.selections, nutId },
    })),
  setContact: (contact) =>
    set((state) => ({
      contact: { ...state.contact, ...contact },
    })),
  resetBuilder: () =>
    set({
      currentStep: 'tier',
      selections: initialSelections,
      contact: initialContact,
    }),
}));
