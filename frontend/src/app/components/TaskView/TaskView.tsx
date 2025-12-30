import { Temporal } from 'temporal-polyfill';
import { ReactNode } from 'react';

export function getDaysLeftInline(dueDate: Temporal.PlainDate): ReactNode {
  const warningLimit = 3;
  const dangerLimit = 0;

  const daysLeft = Temporal.Now.plainDateISO().until(dueDate, {
    largestUnit: 'days',
  }).days;
  const qualifier = daysLeft > -1 ? 'left' : 'overdue';
  return (
    <span
      style={{
        fontStyle: 'italic',
        color: (() => {
          if (daysLeft > warningLimit) return 'green';
          if (daysLeft <= warningLimit && daysLeft > dangerLimit) return '#C7A116';
          if (daysLeft <= dangerLimit) return 'red';
        })(),
      }}
    >
      {' '}
      {Math.abs(daysLeft)}
      {' '}
      day(s)
      {qualifier}
    </span>
  );
}
