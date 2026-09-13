import Hero from '@/components/Hero';
import HeroSimple from '@/components/HeroSimple';
import AmbientPetals from '@/components/AmbientPetals';
import CoupleSection from '@/components/CoupleSection';
import NamesSection from '@/components/NamesSection';
import EventsSection from '@/components/EventsSection';
import PaymentSection from '@/components/PaymentSection';
import DressCodeSection from '@/components/DressCodeSection';
import CountdownSection from '@/components/CountdownSection';
import MomentsSection from '@/components/MomentsSection';
import GallerySection from '@/components/GallerySection';
import SpotifySection from '@/components/SpotifySection';
import PrebodaCarousel from '@/components/PrebodaCarousel';
import GiftSection from '@/components/GiftSection';
import RsvpSection from '@/components/RsvpSection';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';
import { EVENTS, INVITE_TYPES } from '@/lib/event';

export default function Invitation({ type }) {
  const cfg = INVITE_TYPES[type];
  const countdownEvent = EVENTS[cfg.countdownTarget];

  return (
    <>
      {type === 'misa' ? <HeroSimple /> : <Hero />}
      {type !== 'misa' && <NamesSection />}
      <GallerySection />
      <EventsSection type={type} />
      {cfg.payment && <PaymentSection amount={cfg.payment} />}
      <MomentsSection />
      <CountdownSection
        targetIso={countdownEvent.dateTime}
        timeLabel={countdownEvent.time}
      />
      <CoupleSection />
      {cfg.spotify && <SpotifySection />}
      <PrebodaCarousel />
      {type !== 'misa' && <DressCodeSection />}
      {type !== 'misa' && type !== 'fiestaPago' && <GiftSection />}
      <AmbientPetals />
      {type !== 'misa' && <RsvpSection type={type} />}
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
