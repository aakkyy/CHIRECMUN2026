export interface DaisMember {
  role: string
  name: string
}

export const DAIS: Record<string, DaisMember[]> = {
  disec: [
    { role: 'Chairperson',   name: 'Eswar Chava' },
    { role: 'Vice Chair',    name: 'Dhanush Malhotra' },
    { role: 'Rapporteur',    name: 'Vivaan Bhushan' },
  ],
  unhrc: [
    { role: 'Chairperson',   name: 'Chaarmika Nagalla' },
    { role: 'Vice Chair',    name: 'Sarayu' },
    { role: 'Rapporteur',    name: 'Anvit Katturi' },
  ],
  bcci: [
    { role: 'Chairperson',         name: 'Sharan Veluri' },
    { role: 'Co-Vice Chairperson', name: 'Arnav Kaul' },
    { role: 'Co-Vice Chairperson', name: 'Sanjaay Rajkumar' },
  ],
  unodc: [
    { role: 'Co-Chair',    name: 'Sai Eshwar' },
    { role: 'Co-Chair',    name: 'Faraazuddin' },
    { role: 'Vice Chair',  name: 'Aanya Jaidka' },
  ],
  unsc: [
    { role: 'President',   name: 'Aprameya' },
    { role: 'Vice Chair',  name: 'Aanya Jain' },
  ],
  jcc: [
    { role: 'Crisis Director',             name: 'Aravind Y Belur' },
    { role: 'Cabinet I Chairperson',       name: 'Fazil Razak' },
    { role: 'Cabinet I Vice Chairperson',  name: 'Vihaan Reddy' },
    { role: 'Cabinet II Chairperson',      name: 'Ayush R' },
    { role: 'Cabinet II Vice Chairperson', name: 'La Verna Chand' },
  ],
  sci: [
    { role: 'Chief Justice', name: 'Ananth Dhanwantri' },
    { role: 'Justice',       name: 'Seeya Adasada' },
    { role: 'Court Master',  name: 'Hayagreev D' },
  ],
  copuos: [
    { role: 'Chairperson',   name: 'Sai Srikar' },
    { role: 'Vice Chair',    name: 'Sriram Lanka' },
    { role: 'Rapporteur',    name: 'Raghav Modukuri' },
  ],
  loksabha: [
    { role: 'Speaker',         name: 'Charan Krishna Tejh' },
    { role: 'Deputy Speaker',  name: 'Aashi Poogalia' },
    { role: 'Scribe',          name: 'Yusra Talib Hussain' },
  ],
  unctad: [
    { role: 'Chairperson',   name: 'Sashank Srinivas' },
    { role: 'Vice Chair',    name: 'Avirbhav Danamaraju' },
    { role: 'Rapporteur',    name: 'Abhinav Agarwal' },
  ],
  ec: [
    { role: 'Chairperson',   name: 'Vishal Chowdary' },
    { role: 'Vice Chair',    name: 'MS Meenakshi' },
    { role: 'Rapporteur',    name: 'Krishiv Reddy Anantha' },
  ],
  who: [
    { role: 'Co-Chairperson', name: 'Deeksha Singh' },
    { role: 'Co-Chairperson', name: 'Niva Barde' },
    { role: 'Rapporteur',     name: 'Arshia Talwar' },
  ],
  'ip-p': [
    { role: 'Head of IP',             name: 'Sai Preethi Polu' },
    { role: 'Editor in Chief',        name: 'Aanya Patel' },
    { role: 'Director of Photography', name: 'Sankrushi' },
  ],
}
