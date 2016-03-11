module.exports = {

  mig : {
    'songs' : '++id',
    'backdrops' : '++id',
    'templates' : '++id',
    'tracks' : '++id, song_id',
    'arranges' : '++id, song_id',
    'arrange_groups' : '++id, arrange_id'
  }
};