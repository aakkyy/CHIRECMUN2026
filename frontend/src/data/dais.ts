export interface DaisMember {
  role: string
  name: string
}

export const DAIS: Record<string, DaisMember[]> = {
  disec: [
    { role: 'Chairperson',      name: 'Eswar Chava' },
    { role: 'Vice Chairperson', name: 'Prabhas Adabala' },
    { role: 'Rapporteur',       name: 'Vivaan Bhushan' },
  ],
  unhrc: [
    { role: 'Chairperson',      name: 'Chaarmika Nagalla' },
    { role: 'Vice Chairperson', name: 'Sarayu' },
    { role: 'Rapporteur',       name: 'Anvit Katturi' },
  ],
}
