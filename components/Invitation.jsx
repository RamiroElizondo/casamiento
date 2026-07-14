import Hero from '@/components/Hero';
import AmbientPetals from '@/components/AmbientPetals';
import CoupleSection from '@/components/CoupleSection';
import NamesSection from '@/components/NamesSection';
import EventsSection from '@/components/EventsSection';
import DressCodeSection from '@/components/DressCodeSection';
import CountdownSection from '@/components/CountdownSection';
import GallerySection from '@/components/GallerySection';
import SpotifySection from '@/components/SpotifySection';
import RsvpSection from '@/components/RsvpSection';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';
import { EVENTS, INVITE_TYPES } from '@/lib/event';

export default function Invitation({ type }) {
  const cfg = INVITE_TYPES[type];
  const countdownEvent = EVENTS[cfg.countdownTarget];

  return (
    <>
      <Hero />
      <NamesSection />
      <GallerySection />
      <EventsSection type={type} />
      <DressCodeSection />
      <CountdownSection
        targetIso={countdownEvent.dateTime}
        timeLabel={countdownEvent.time}
      />
      <CoupleSection />
      {cfg.spotify && <SpotifySection />}
      <AmbientPetals />
      <RsvpSection type={type} />
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
