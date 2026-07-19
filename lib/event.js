// Configuración central del evento. Todo dato editable vive acá.

export const WEDDING = {
  couple: 'Yamila & Gonzalo',
  dateLabel: 'Sábado 24 de Octubre de 2026',
  shortDate: '24 · Octubre · 2026',
};

export const EVENTS = {
  misa: {
    icon: 'church',
    title: 'Ceremonia Religiosa',
    time: '18:00 hs',
    dateTime: '2026-10-24T18:00:00-03:00',
    place: 'Parroquia de Santa Lucía',
    address: 'Ramón Franco 430, Santa Lucía, San Juan',
    mapsQuery: 'Parroquia de Santa Lucía, Ramón Franco 430, Santa Lucía, San Juan',
  },
  civil:  {
    icon: 'church',
    title: 'Ceremonia civil',
    time: '22:00 hs',
    dateTime: '2026-10-24T22:00:00-03:00',
    place: 'Salón Tierras Negras',
    address: 'Calle 11, 300 m al este de RN 40, San Juan',
    mapsQuery: 'Tierras Negras, Calle 11, San Juan, Argentina',
  },
  recepcion: {
    icon: 'party',
    title: 'Recepción',
    time: '21:00 hs',
    dateTime: '2026-10-24T21:00:00-03:00',
    place: 'Tierras Negras',
    address: 'Calle 11, 300 m al este de RN 40, San Juan',
    mapsQuery: 'Tierras Negras, Calle 11, San Juan, Argentina',
  },
  cena: {
    icon: 'dinner',
    title: 'Cena',
    time: '23:00 hs',
    dateTime: '2026-10-24T23:00:00-03:00',
    place: 'Tierras Negras',
    address: 'Calle 11, 300 m al este de RN 40, San Juan',
    mapsQuery: 'Tierras Negras, Calle 11, San Juan, Argentina',
  },
  fiesta: {
    icon: 'party',
    title: 'Fiesta',
    time: '00:30 hs',
    dateTime: '2026-10-25T00:30:00-03:00',
    place: 'Tierras Negras',
    address: 'Calle 11, 300 m al este de RN 40, San Juan',
    mapsQuery: 'Tierras Negras, Calle 11, San Juan, Argentina',
  },
};

// Tipos de invitación y qué ve cada uno.
export const INVITE_TYPES = {
  full: {
    events: ['misa', 'recepcion','civil', 'cena', 'fiesta'],
    countdownTarget: 'misa',
    rsvpLabel: 'la ceremonia y la fiesta',
    spotify: true,
  },
  misa: {
    events: ['misa'],
    countdownTarget: 'misa',
    rsvpLabel: 'la ceremonia',
    spotify: false,
  },
  fiesta: {
    events: ['fiesta'],
    countdownTarget: 'fiesta',
    rsvpLabel: 'la fiesta',
    spotify: true,
  },
};

// UUID → tipo de invitación. Cada invitado recibe su link según lo que le corresponde.
export const INVITES = {
  '194aeb9e-117d-448f-996b-fe0a92e59475': 'full',
  'f7dc8973-9699-48a0-b0bc-177a5c04b284': 'misa',
  '72f08b4e-f9a2-439e-90ba-c8465cb79bd6': 'fiesta',
};

export const WHATSAPP_NUMBER = '5492645554314'; // Gonzalo

export function mapsUrl(eventKey) {
  return (
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(EVENTS[eventKey].mapsQuery)
  );
}

export function whatsappUrl(type) {
  const label = INVITE_TYPES[type].rsvpLabel;
  const msg = `¡Hola! Quiero confirmar mi asistencia a ${label} del casamiento de Yamila y Gonzalo 🤍`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
