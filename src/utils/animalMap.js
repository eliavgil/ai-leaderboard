const ANIMALS = [
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐯', name: 'Tiger' },
  { emoji: '🐺', name: 'Wolf' },
  { emoji: '🦄', name: 'Unicorn' },
  { emoji: '🐉', name: 'Dragon' },
  { emoji: '🦅', name: 'Eagle' },
  { emoji: '🦋', name: 'Butterfly' },
  { emoji: '🐬', name: 'Dolphin' },
  { emoji: '🦈', name: 'Shark' },
  { emoji: '🐻', name: 'Bear' },
  { emoji: '🦝', name: 'Raccoon' },
  { emoji: '🦜', name: 'Parrot' },
  { emoji: '🐙', name: 'Octopus' },
  { emoji: '🦩', name: 'Flamingo' },
  { emoji: '🐊', name: 'Croc' },
  { emoji: '🦚', name: 'Peacock' },
  { emoji: '🦭', name: 'Seal' },
  { emoji: '🐆', name: 'Leopard' },
  { emoji: '🦓', name: 'Zebra' },
  { emoji: '🦒', name: 'Giraffe' },
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🦛', name: 'Hippo' },
  { emoji: '🦦', name: 'Otter' },
  { emoji: '🦥', name: 'Sloth' },
  { emoji: '🦔', name: 'Hedgehog' },
  { emoji: '🐳', name: 'Whale' },
  { emoji: '🦑', name: 'Squid' },
  { emoji: '🐲', name: 'Wyrm' },
]

/**
 * Build a name→animal map. Sort names alphabetically so the same
 * set of names always yields the same assignments, and each animal
 * is unique within the class roster.
 */
export function buildAnimalMap(names) {
  const unique = [...new Set(names.map(n => n.trim()).filter(Boolean))].sort()
  const map = {}
  unique.forEach((name, i) => {
    map[name] = ANIMALS[i % ANIMALS.length]
  })
  return map
}
