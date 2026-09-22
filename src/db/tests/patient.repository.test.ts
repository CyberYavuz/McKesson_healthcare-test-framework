import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { closePool } from '../client';
import { PatientRepository } from '../repositories/patient.repository';

describe('PatientRepository', () => {
  const repository = new PatientRepository();
  const createdIds: string[] = [];

  afterEach(async () => {
    // Clean up every row created during the test so suites stay isolated
    // and re-runnable against a shared database.
    while (createdIds.length > 0) {
      const id = createdIds.pop();
      if (id) {
        await repository.deleteById(id);
      }
    }
  });

  afterAll(async () => {
    await closePool();
  });

  it('creates a patient and reads it back', async () => {
    const created = await repository.create({
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1990-05-14',
    });
    createdIds.push(created.id);

    const found = await repository.findById(created.id);

    expect(found).toMatchObject({
      firstName: 'Jane',
      lastName: 'Doe',
    });
  });

  it('returns undefined for a patient that does not exist', async () => {
    const found = await repository.findById('00000000-0000-0000-0000-000000000000');

    expect(found).toBeUndefined();
  });
});
