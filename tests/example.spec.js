
import { test, expect } from '@playwright/test';

test('Connexion administrateur ALBA', async ({ page }) => {

  // 1. Ouvrir la page de connexion
  await page.goto('/');

  // 2. Saisir les identifiants
  await page.getByPlaceholder('Entrez votre email')
    .fill('admin@alba.com');

  await page.locator('input[type="password"]')
    .fill('123456');

  // 3. Cliquer sur Se connecter
  await page.getByRole('button', { name: 'Se connecter' })
    .click();

  // 4. Vérifier que le menu Voiture apparaît
  await expect(
    page.getByText('Voiture', { exact: true })
  ).toBeVisible();

});
