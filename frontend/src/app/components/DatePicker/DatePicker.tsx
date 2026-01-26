import { DayPicker } from 'react-day-picker';
import { Temporal } from 'temporal-polyfill';

import { useState, useEffect, useRef } from 'react';

export default function DatePicker({
  defaultValue,
}: {
  defaultValue?: Temporal.PlainDate;
}) {
  const [date, setDate] = useState<Date | undefined>(initializeDate());
  const [pickerActive, setPickerActive] = useState<boolean>(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const readyToReturnFocus = useRef<boolean>(false);

  useEffect(() => {
    if (!pickerActive && readyToReturnFocus.current) {
      buttonRef.current?.focus();
      readyToReturnFocus.current = false;
    } else if (pickerActive) {
      readyToReturnFocus.current = true;

      requestAnimationFrame(() => {
        const currentDayButton = pickerRef.current?.querySelector<HTMLButtonElement>(
          'td[data-today="true"] > button.rdp-day-button',
        );
        currentDayButton?.focus();
      });
    }
  }, [pickerActive]);

  function initializeDate(): Date | undefined {
    if (defaultValue) {
      let temporalInstant = defaultValue
        .toZonedDateTime({
          timeZone: "UTC",
          plainTime: Temporal.PlainTime.from("00:00"),
        })
        .toInstant();
      let result = new Date(temporalInstant.epochMilliseconds);

      return result;
    }
    else return undefined;
  }

  function handleDateSelection(selectedDate: Date | undefined) {
    if (!selectedDate) return;
    setDate(selectedDate);
    setPickerActive(false);

    buttonRef.current?.focus();
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (pickerActive && e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setPickerActive(false);
    }
  }

  return (
    <>
      <input
        type="hidden"
        name="dueDate"
        value={date ? date.toISOString().split('T')[0] : ''}
      />
      {pickerActive ? (
        <div
          className="details-body"
          onKeyDown={handleKeyPress}
          ref={pickerRef}
        >
          <DayPicker
            mode="single"
            selected={date}
            onDayClick={handleDateSelection}
            autoFocus
          />
        </div>
      ) : (
        <button
          type="button"
          ref={buttonRef}
          onClick={() => setPickerActive(true)}
        >
          {date ? date.toDateString() : 'Select Date'}
        </button>
      )}
    </>
  );
}
