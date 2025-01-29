import apiClient from './api';

interface Weapon {
    name: string;
    mod: number;
    attr: number;
    equipped: boolean
  }
  
  export interface Knight {
    id: number;
    name: string;
    nickname: string
    birthday: Date;
    weapons: Weapon[];
    keyAttribute: string;
    attributes: { [key: string]: number };
    isHero: boolean;
  }

export const getKnights = async (): Promise<Knight[]> => {
  const response = await apiClient.get('/knights');
  return response.data;
};

export const getHeroKnights = async (): Promise<Knight[]> => {
  const response = await apiClient.get('/knights?filter=heroes');
  return response.data;
};

export const createKnight = async (knight: Omit<Knight, 'id'>): Promise<Knight> => {
    const formattedKnight = {
      ...knight,
      birthday: new Date(knight.birthday),
      weapons: knight.weapons.map(weapon => ({
        ...weapon,
        equipped: weapon.equipped === 'true'
      }))
    };
  
    const response = await apiClient.post('/knights', formattedKnight);
    return response.data;
  };

export const updateKnight = async (id: number, nickname: string): Promise<Knight> => {
  const response = await apiClient.patch(`/knights/${id}/nickname`, { nickname });
  return response.data;
};

export const deleteKnight = async (id: number): Promise<void> => {
  await apiClient.delete(`/knights/${id}`);
};
