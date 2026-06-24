'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { builderUi } from '@/constants/builder';
import { getBuilderOptions } from '@/lib/builder';
import { submitCustomOrder } from '@/lib/orders';
import { useCakeBuilderStore } from '@/store/cakeBuilderStore';
import {
  BUILDER_STEPS,
  BUILDER_STEP_LABELS,
  type BuilderStep,
} from '@/types';
import type { BuilderNamedOption, BuilderOptions, BuilderTier } from '@/types/builder';
import type { Size } from '@/types/catalog';

type BuilderOption = BuilderNamedOption | BuilderTier | Size;

function getSubtitle(option: BuilderOption): string | undefined {
  if ('guestRange' in option) {
    return option.guestRange;
  }
  if ('level' in option) {
    return `${option.level}`;
  }
  return undefined;
}

function SelectionGrid({
  options,
  selectedId,
  onSelect,
}: {
  options: BuilderOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const isSelected = selectedId === option._id;
        const subtitle = getSubtitle(option);

        return (
          <button
            key={option._id}
            type="button"
            onClick={() => onSelect(option._id)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              isSelected
                ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-200'
                : 'border-stone-200 bg-white hover:border-rose-200 hover:bg-rose-50/40'
            }`}
          >
            <p className="font-semibold text-stone-900">{option.name}</p>
            {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
          </button>
        );
      })}
    </div>
  );
}

function getOptionName(options: BuilderOption[], id: string | null): string {
  if (!id) {
    return '—';
  }
  return options.find((option) => option._id === id)?.name ?? '—';
}

export default function CakeBuilderWizard() {
  const {
    currentStep,
    selections,
    contact,
    setStep,
    nextStep,
    prevStep,
    setTierId,
    setSizeId,
    setFillingId,
    setFruitId,
    setNutId,
    setContact,
    resetBuilder,
  } = useCakeBuilderStore();

  const [options, setOptions] = useState<BuilderOptions | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    getBuilderOptions()
      .then((data) => {
        setOptions(data);
        setLoadError(false);
      })
      .catch(() => {
        setOptions(null);
        setLoadError(true);
      })
      .finally(() => setLoadingOptions(false));
  }, []);

  const currentStepIndex = BUILDER_STEPS.indexOf(currentStep);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 'tier':
        return Boolean(selections.tierId);
      case 'size':
        return Boolean(selections.sizeId);
      case 'filling':
        return Boolean(selections.fillingId);
      case 'fruit-nut':
        return Boolean(selections.fruitId && selections.nutId);
      case 'summary':
        return Boolean(contact.name.trim() && contact.phone.trim());
      default:
        return false;
    }
  }, [currentStep, selections, contact]);

  const handleNext = () => {
    if (!canProceed) {
      setValidationError(builderUi.stepRequired);
      return;
    }
    setValidationError(null);
    nextStep();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (
      !selections.tierId ||
      !selections.sizeId ||
      !selections.fillingId ||
      !selections.fruitId ||
      !selections.nutId ||
      !contact.name.trim() ||
      !contact.phone.trim()
    ) {
      setValidationError(builderUi.requiredField);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitCustomOrder({
        orderType: 'custom',
        customer: {
          name: contact.name.trim(),
          phone: contact.phone.trim(),
          email: contact.email.trim() || undefined,
        },
        customSelections: {
          tier: selections.tierId,
          size: selections.sizeId,
          filling: selections.fillingId,
          fruit: selections.fruitId,
          nut: selections.nutId,
        },
        deliveryDate: contact.deliveryDate || undefined,
        notes: contact.notes.trim() || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : builderUi.loadError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    resetBuilder();
    setSubmitted(false);
    setSubmitError(null);
    setValidationError(null);
  };

  if (loadingOptions) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-96 animate-pulse rounded-3xl bg-rose-100/70" />
      </div>
    );
  }

  if (loadError || !options) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-stone-600">
        {builderUi.loadError}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-green-200 bg-green-50 p-10">
          <p className="text-5xl" aria-hidden="true">
            ✅
          </p>
          <h2 className="mt-4 text-2xl font-bold text-green-900">{builderUi.successTitle}</h2>
          <p className="mt-3 text-green-800">{builderUi.successMessage}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white"
            >
              {builderUi.newOrder}
            </button>
            <Link
              href="/"
              className="rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-900"
            >
              {builderUi.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-rose-950 sm:text-4xl">{builderUi.pageTitle}</h1>
        <p className="mt-3 text-stone-600">{builderUi.pageSubtitle}</p>
      </div>

      <ol className="mb-8 flex flex-wrap gap-2">
        {BUILDER_STEPS.map((step, index) => {
          const isActive = step === currentStep;
          const isComplete = index < currentStepIndex;

          return (
            <li key={step}>
              <button
                type="button"
                onClick={() => {
                  if (index <= currentStepIndex) {
                    setStep(step);
                  }
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm ${
                  isActive
                    ? 'bg-rose-700 text-white'
                    : isComplete
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-stone-100 text-stone-500'
                }`}
              >
                {BUILDER_STEP_LABELS[step as BuilderStep]}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        {currentStep === 'tier' && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">{builderUi.selectTier}</h2>
            <SelectionGrid
              options={options.tiers}
              selectedId={selections.tierId}
              onSelect={setTierId}
            />
          </section>
        )}

        {currentStep === 'size' && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">{builderUi.selectSize}</h2>
            <SelectionGrid
              options={options.sizes}
              selectedId={selections.sizeId}
              onSelect={setSizeId}
            />
          </section>
        )}

        {currentStep === 'filling' && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">{builderUi.selectFilling}</h2>
            <SelectionGrid
              options={options.fillings}
              selectedId={selections.fillingId}
              onSelect={setFillingId}
            />
          </section>
        )}

        {currentStep === 'fruit-nut' && (
          <section className="space-y-8">
            <div>
              <h2 className="mb-4 text-xl font-semibold">{builderUi.selectFruit}</h2>
              <SelectionGrid
                options={options.fruits}
                selectedId={selections.fruitId}
                onSelect={setFruitId}
              />
            </div>
            <div>
              <h2 className="mb-4 text-xl font-semibold">{builderUi.selectNut}</h2>
              <SelectionGrid
                options={options.nuts}
                selectedId={selections.nutId}
                onSelect={setNutId}
              />
            </div>
          </section>
        )}

        {currentStep === 'summary' && (
          <section className="space-y-8">
            <div>
              <h2 className="mb-4 text-xl font-semibold">{builderUi.summaryTitle}</h2>
              <dl className="grid gap-3 rounded-2xl bg-rose-50 p-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-stone-500">{BUILDER_STEP_LABELS.tier}</dt>
                  <dd className="font-medium">{getOptionName(options.tiers, selections.tierId)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-500">{BUILDER_STEP_LABELS.size}</dt>
                  <dd className="font-medium">{getOptionName(options.sizes, selections.sizeId)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-500">{BUILDER_STEP_LABELS.filling}</dt>
                  <dd className="font-medium">
                    {getOptionName(options.fillings, selections.fillingId)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-500">{BUILDER_STEP_LABELS['fruit-nut']}</dt>
                  <dd className="font-medium">
                    {getOptionName(options.fruits, selections.fruitId)} /{' '}
                    {getOptionName(options.nuts, selections.nutId)}
                  </dd>
                </div>
              </dl>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold">{builderUi.contactTitle}</h2>

              <label className="block text-sm font-medium text-stone-700">
                {builderUi.name}
                <input
                  required
                  value={contact.name}
                  onChange={(event) => setContact({ name: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
                />
              </label>

              <label className="block text-sm font-medium text-stone-700">
                {builderUi.phone}
                <input
                  required
                  type="tel"
                  value={contact.phone}
                  onChange={(event) => setContact({ phone: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
                />
              </label>

              <label className="block text-sm font-medium text-stone-700">
                {builderUi.email}
                <input
                  type="email"
                  value={contact.email}
                  onChange={(event) => setContact({ email: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
                />
              </label>

              <label className="block text-sm font-medium text-stone-700">
                {builderUi.deliveryDate}
                <input
                  type="date"
                  value={contact.deliveryDate}
                  onChange={(event) => setContact({ deliveryDate: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
                />
              </label>

              <label className="block text-sm font-medium text-stone-700">
                {builderUi.notes}
                <textarea
                  rows={3}
                  value={contact.notes}
                  onChange={(event) => setContact({ notes: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
                />
              </label>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            </form>
          </section>
        )}

        {validationError && <p className="mt-4 text-sm text-red-600">{validationError}</p>}

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {builderUi.prev}
          </button>

          {currentStep !== 'summary' ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {builderUi.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? builderUi.submitting : builderUi.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
