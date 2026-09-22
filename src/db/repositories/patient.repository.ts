import { getPool } from '../client';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface NewPatient {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface PatientRow {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

function toPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
  };
}

/**
 * Example repository showing the pattern to follow for new domain tables:
 * parameterized queries only, typed rows, and a mapper from snake_case
 * database columns to camelCase domain objects.
 */
export class PatientRepository {
  async create(patient: NewPatient): Promise<Patient> {
    const pool = getPool();
    const result = await pool.query<PatientRow>(
      `INSERT INTO patients (first_name, last_name, date_of_birth)
       VALUES ($1, $2, $3)
       RETURNING id, first_name, last_name, date_of_birth`,
      [patient.firstName, patient.lastName, patient.dateOfBirth]
    );
    return toPatient(result.rows[0]);
  }

  async findById(id: string): Promise<Patient | undefined> {
    const pool = getPool();
    const result = await pool.query<PatientRow>(
      `SELECT id, first_name, last_name, date_of_birth FROM patients WHERE id = $1`,
      [id]
    );
    return result.rows[0] ? toPatient(result.rows[0]) : undefined;
  }

  async deleteById(id: string): Promise<void> {
    const pool = getPool();
    await pool.query(`DELETE FROM patients WHERE id = $1`, [id]);
  }
}
