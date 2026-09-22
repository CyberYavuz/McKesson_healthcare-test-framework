Feature: Healthcare portal access
  As a patient
  I want to reach the healthcare portal
  So that I can sign in to manage my care

  @smoke
  Scenario: Landing page loads successfully
    Given I open the healthcare portal
    Then the page title contains "Example Domain"

  @smoke @db
  Scenario: Database is reachable
    Then the database is reachable
