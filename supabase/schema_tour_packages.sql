-- =========================================================================
-- Supabase Schema for Tour Packages (Ceylon Trail)
-- Run this script in your Supabase Project -> SQL Editor
-- =========================================================================

-- 1. Create table 'tour_packages'
create table if not exists public.tour_packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  duration text not null,
  route_locations text not null,
  description text not null,
  highlights text[] default array[]::text[],
  inclusions text[] default array[
    'Dedicated Tourist Vehicle',
    'English-fluent Driver',
    'Fuel & Expressway Tolls',
    'Airport Pickup & Drop',
    'Comprehensive Insurance',
    '24/7 Islandwide Backup'
  ]::text[],
  price numeric not null default 0,
  image_url text not null default '/images/sigiriya.jpg',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.tour_packages enable row level security;

-- 3. Policy: Public Read Access
drop policy if exists "Allow public read on tour_packages" on public.tour_packages;
create policy "Allow public read on tour_packages"
  on public.tour_packages for select
  using (true);

-- 4. Policy: Allow full modifications (insert, update, delete)
drop policy if exists "Allow all operations on tour_packages" on public.tour_packages;
create policy "Allow all operations on tour_packages"
  on public.tour_packages for all
  using (true)
  with check (true);

-- 5. Seed Initial Tour Packages
insert into public.tour_packages (title, duration, route_locations, description, price, image_url, highlights, inclusions)
values
(
  'Classic Ceylon Explorer',
  '7 Days / 6 Nights',
  'Negombo, Kandy, Nuwara Eliya, Galle',
  'The quintessential first-timer circuit. UNESCO cultural triangle, sacred Kandy relics, misty high-elevation tea plantations, down to southern colonial fortress.',
  490,
  '/images/sigiriya.jpg',
  array[
    'Sigiriya Rock Fortress sunrise climb',
    'Sacred Temple of the Tooth Relic in Kandy',
    'Scenic tea estate tour & tasting in Nuwara Eliya',
    'St. Clair & Devon Waterfalls panoramic view',
    'UNESCO Galle Dutch Fort sunset walk',
    'Colombo Airport (BIA) VIP Meet & Greet'
  ],
  array[
    'Dedicated Tourist Vehicle',
    'English-fluent Driver',
    'Fuel & Expressway Tolls',
    'Airport Pickup & Drop',
    'Comprehensive Insurance',
    '24/7 Islandwide Backup'
  ]
),
(
  'Hill Country & Tea Trails',
  '4 Days / 3 Nights',
  'Kandy, Ella, Horton Plains, Little Adam''s Peak',
  'Traverse panoramic waterfalls, cool temperate mountain towns, historic British colonial bungalows, and scenic hikes through rolling Ceylon tea valleys.',
  280,
  '/images/ella-bridge.jpg',
  array[
    'Famous Demodara Nine Arch Bridge in Ella',
    'Little Adam''s Peak & Ravana Falls exploration',
    'Horton Plains National Park & World''s End trek',
    'Colonial tea factory private tour',
    'Kandy Lake & Royal Botanical Gardens Peradeniya'
  ],
  array[
    'Dedicated Tourist Vehicle',
    'English-fluent Driver',
    'Fuel & Expressway Tolls',
    'Airport Pickup & Drop',
    'Comprehensive Insurance',
    '24/7 Islandwide Backup'
  ]
),
(
  'Grand Island Grand Loop',
  '10 Days / 9 Nights',
  'Anuradhapura, Trincomalee, Ella, Yala, Galle',
  'The definitive comprehensive expedition. From northern ancient kingdoms to Eastern secluded surf beaches, wild leopard safaris in Yala, and coastal drives back to BIA Airport.',
  720,
  '/images/mirissa-beach.jpg',
  array[
    'Sacred ancient city of Anuradhapura & Polonnaruwa',
    'Pristine beaches and Nilaveli Pigeon Island in Trincomalee',
    'Nine Arch Bridge & Ella gap views',
    'Yala National Park 4x4 wild Leopard & Elephant safari',
    'Mirissa coconut hill & whale watching options',
    'Southern expressway direct drop to Katunayake BIA'
  ],
  array[
    'Dedicated Tourist Vehicle',
    'English-fluent Driver',
    'Fuel & Expressway Tolls',
    'Airport Pickup & Drop',
    'Comprehensive Insurance',
    '24/7 Islandwide Backup'
  ]
)
on conflict do nothing;
