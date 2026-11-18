
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Connexion administrateur ALBA', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Entrez votre email')
    .fill('admin@alba.com');

  await page.locator('input[type="password"]')
    .fill('123456');

  await page.getByRole('button', { name: 'Se connecter' })
    .click();

  await expect(
    page.getByText('Voitures', { exact: true })
  ).toBeVisible();
});

test('Création d une maintenance ALBA', async ({ page }) => {
  // 1. Connexion administrateur
  await page.goto('/');

  await page.getByPlaceholder('Entrez votre email')
    .fill('admin@alba.com');

  await page.locator('input[type="password"]')
    .fill('123456');

  await page.getByRole('button', { name: 'Se connecter' })
    .click();

  await expect(
    page.getByText('Voitures', { exact: true })
  ).toBeVisible();

  // 2. Accéder aux véhicules
  await page.locator('div:nth-child(3) > div:nth-child(2)')
    .click();

  // 3. Ouvrir le formulaire de maintenance
  await page.getByRole('button', { name: 'Maintenance' })
    .click();

  await expect(
    page.getByRole('heading', { name: 'Gestion de la Maintenance' })
  ).toBeVisible();

  // 4. Remplir le formulaire
  await page.locator('select[name="type_maintenance"]')
    .selectOption('Révision générale');

  await page.locator('select[name="technicien"]')
    .selectOption('7');

  await page.locator('input[name="date_fin_prevue"]')
    .fill('2026-11-25');

  await page.getByRole('spinbutton', { name: '0.00' })
    .fill('350');

  await page.getByRole('textbox', { name: 'Notes...' })
    .fill('Test automatisé Playwright S9 - deuxième test.');

  // 5. Ajouter la maintenance
  await page.getByRole('button', { name: 'Ajouter' })
    .click();

  // 6. Vérifier le résultat
  await expect(
    page.getByText('Maintenance en cours').first()
  ).toBeVisible();

  await page.screenshot({
    path: 'screenshots/S9_04_Creation_Maintenance.png',
    fullPage: true
  });
});

test('Performance - Temps de chargement ALBA', async ({ page }) => {
  const start = Date.now();

  await page.goto('/');

  await page.locator('input[type="password"]').waitFor({
    state: 'visible'
  });

  const loadTime = Date.now() - start;

  console.log('Temps de chargement ALBA : ' + loadTime + ' ms');

  expect(loadTime).toBeLessThan(10000);
});

test('Sécurité - Refus connexion incorrecte', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Entrez votre email')
    .fill('admin@alba.com');

  await page.locator('input[type="password"]')
    .fill('motdepasseincorrect');

  await page.getByRole('button', { name: 'Se connecter' })
    .click();

  const loginButton = page.getByRole('button', {
    name: /Se connecter|Connexion en cours/
  });

  await expect(loginButton).toBeEnabled({ timeout: 10000 });

  await expect(
    page.getByPlaceholder('Entrez votre email')
  ).toBeVisible();
});

test('Accessibilité - Page de connexion ALBA', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Entrez votre email').waitFor({
    state: 'visible'
  });

  const accessibilityScan = await new AxeBuilder({ page }).analyze();

  console.log(
    'Nombre de problèmes d accessibilité :',
    accessibilityScan.violations.length
  );

  for (const violation of accessibilityScan.violations) {
    console.log('Problème :', violation.id);
    console.log('Impact :', violation.impact);
    console.log('Description :', violation.description);
  }

  expect(accessibilityScan.violations.length).toBeLessThanOrEqual(1);
});
