import { CategoryData } from '@/types/form';

export const sizeData: Record<string, CategoryData> = {
  kids: {
    name: 'Kids',
    folder: 'Gucci Kids No Background',
    images: Array.from({ length: 34 }, (_, i) => `Kid ${i + 1}.png`),
    sizes: [
      { value: '2T', label: '2T', details: 'Age: 1-2 yrs | Height: 84-91 cm | Chest: 52-53 cm | Waist: 51-52 cm' },
      { value: '3T', label: '3T', details: 'Age: 2-3 yrs | Height: 91-98 cm | Chest: 53-55 cm | Waist: 52-53 cm' },
      { value: '4T', label: '4T', details: 'Age: 3-4 yrs | Height: 98-104 cm | Chest: 55-56 cm | Waist: 53-54 cm' },
      { value: '5-6', label: '5-6', details: 'Age: 5-6 yrs | Height: 110-116 cm | Chest: 57-59 cm | Waist: 54-55 cm' },
      { value: '7-8', label: '7-8', details: 'Age: 7-8 yrs | Height: 122-128 cm | Chest: 60-64 cm | Waist: 56-58 cm' },
      { value: '9-10', label: '9-10', details: 'Age: 9-10 yrs | Height: 134-140 cm | Chest: 66-70 cm | Waist: 59-61 cm' },
      { value: '11-12', label: '11-12', details: 'Age: 11-12 yrs | Height: 146-152 cm | Chest: 72-76 cm | Waist: 62-64 cm' },
      { value: '13-14', label: '13-14', details: 'Age: 13-14 yrs | Height: 158-164 cm | Chest: 78-84 cm | Waist: 65-67 cm' },
      { value: '15-16', label: '15-16', details: 'Age: 15-16 yrs | Height: 170-176 cm | Chest: 86-92 cm | Waist: 68-70 cm' },
    ]
  },
  ladies: {
    name: 'Ladies',
    folder: 'Gucci Ladies No Background',
    images: Array.from({ length: 46 }, (_, i) => i + 1)
      .filter(n => n < 15 || n > 19)
      .map(n => `G${n}.png`),
    sizes: [
      { value: 'XS', label: 'XS', details: 'US: 2 | UK: 6 | EU: 34 | Chest: 76-80 cm | Waist: 60-64 cm | Hips: 84-88 cm' },
      { value: 'S', label: 'S', details: 'US: 4 | UK: 8 | EU: 36 | Chest: 80-84 cm | Waist: 64-68 cm | Hips: 88-92 cm' },
      { value: 'M', label: 'M', details: 'US: 6 | UK: 10 | EU: 38 | Chest: 84-88 cm | Waist: 68-72 cm | Hips: 92-96 cm' },
      { value: 'L', label: 'L', details: 'US: 8 | UK: 12 | EU: 40 | Chest: 88-94 cm | Waist: 72-78 cm | Hips: 96-102 cm' },
      { value: 'XL', label: 'XL', details: 'US: 10 | UK: 14 | EU: 42 | Chest: 94-100 cm | Waist: 78-84 cm | Hips: 102-108 cm' },
      { value: 'XXL', label: 'XXL', details: 'US: 12 | UK: 16 | EU: 44 | Chest: 100-106 cm | Waist: 84-90 cm | Hips: 108-114 cm' },
      { value: '3XL', label: '3XL', details: 'US: 14 | UK: 18 | EU: 46 | Chest: 106-112 cm | Waist: 90-96 cm | Hips: 114-120 cm' },
      { value: '4XL', label: '4XL', details: 'US: 16 | UK: 20 | EU: 48 | Chest: 112-118 cm | Waist: 96-102 cm | Hips: 120-126 cm' },
    ]
  },
  mens: {
    name: 'Mens',
    folder: 'Mens',
    images: Array.from({ length: 36 }, (_, i) => `M${i + 1}.png`),
    sizes: [
      { value: 'XS', label: 'XS', details: 'Chest: 84-88 cm | Waist: 70-74 cm | Hips: 84-88 cm | Height: 160-170 cm' },
      { value: 'S', label: 'S', details: 'Chest: 88-94 cm | Waist: 74-80 cm | Hips: 88-94 cm | Height: 165-175 cm' },
      { value: 'M', label: 'M', details: 'Chest: 94-100 cm | Waist: 80-86 cm | Hips: 94-100 cm | Height: 170-180 cm' },
      { value: 'L', label: 'L', details: 'Chest: 100-106 cm | Waist: 86-92 cm | Hips: 100-106 cm | Height: 175-185 cm' },
      { value: 'XL', label: 'XL', details: 'Chest: 106-112 cm | Waist: 92-98 cm | Hips: 106-112 cm | Height: 180-190 cm' },
      { value: 'XXL', label: 'XXL', details: 'Chest: 112-118 cm | Waist: 98-104 cm | Hips: 112-118 cm | Height: 185-195 cm' },
      { value: '3XL', label: '3XL', details: 'Chest: 118-124 cm | Waist: 104-110 cm | Hips: 118-124 cm | Height: 185-200 cm' },
      { value: '4XL', label: '4XL', details: 'Chest: 124-130 cm | Waist: 110-116 cm | Hips: 124-130 cm | Height: 185-205 cm' },
    ]
  }
}; 