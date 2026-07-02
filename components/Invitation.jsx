import Hero from '@/components/Hero';
import NamesSection from '@/components/NamesSection';
import EventsSection from '@/components/EventsSection';
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
      <EventsSection type={type} />
      <CountdownSection
        targetIso={countdownEvent.dateTime}
        timeLabel={countdownEvent.time}
      />
      <GallerySection />
      {cfg.spotify && <SpotifySection />}
      <RsvpSection type={type} />
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
