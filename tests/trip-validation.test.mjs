import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTripPreferences, parseItinerary } from '../src/create-trip/validation.js';

const good = { location: { label: 'New York' }, noOfDays: '3', budget: 'Moderate', traveler: '2 People' };

test('accepts a complete supported trip', () => {
  assert.equal(validateTripPreferences(good), null);
});

test('requires every field and bounds trip duration', () => {
  for (const patch of [
    { location: null }, { noOfDays: '' }, { noOfDays: '0' }, { noOfDays: '6' },
    { noOfDays: '2.5' }, { budget: '' }, { traveler: null },
  ]) {
    assert.equal(typeof validateTripPreferences({ ...good, ...patch }), 'string');
  }
  assert.equal(typeof validateTripPreferences(null), 'string');
});

test('parses plain and fenced JSON while rejecting an invalid schema', () => {
  const content = JSON.stringify({ hotels: [], itinerary: [{ day: 'Day 1', plan: [] }] });
  const fence = String.fromCharCode(96).repeat(3);
  assert.equal(parseItinerary(content).itinerary.length, 1);
  assert.equal(parseItinerary(fence + 'json\n' + content + '\n' + fence).itinerary.length, 1);
  assert.throws(() => parseItinerary('{"hotels":[]}'), /schema/);
  assert.throws(() => parseItinerary('not json'), SyntaxError);
});
