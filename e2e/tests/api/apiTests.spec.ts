import { test, expect } from '@playwright/test';
import { newPet, findAvailablePets, findSoldPets } from '../../assets/api.json';

test.describe('testing dropit api requests', () => {
  test('create new pet and update successfully', async ({ request }) => {
    const postRes = await request.post(newPet.reqUrl, {
      data: newPet.payload,
    });
    expect(postRes.status()).toBe(200);

    newPet.payload.status = 'sold';
    const updateRes = await request.put(newPet.reqUrl, {
      data: newPet.payload,
    });
    expect(postRes.status()).toBe(200);

    const resJson = await updateRes.json();
    expect(resJson.status).toBe('sold');
  });

  test('verify 4th pet name successfully', async ({ request }) => {
    const res = await request.get(findAvailablePets.reqUrl);
    expect(res.status()).toBe(200);
    const fourthPetName = await res.json();
    expect(fourthPetName[3].name, '4th pet name has changed').toBe('Puff'); // its not always the 4th - see console.log next line
    console.log(fourthPetName);
  });

  test('verify sold status pets successfully', async ({ request }) => {
    const res = await request.get(findSoldPets.reqUrl);
    expect(res.status()).toBe(200);
    const soldPets = await res.json();
    try {
      expect(soldPets.length).toBeGreaterThan(0);
      for (const soldPet of soldPets) {
        expect(soldPet.status).toBe('sold');
      }
    } catch {
      throw 'no sold pets';
    }
  });
});
