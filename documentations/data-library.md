# Lyric format

## Song
[{
  uuid : 'xxx-xxx-xxx-xxx',
  title : 'Amazing Grace',
  preview : 'lyric preview ...'
}, ...]

## Song-Lyric
{
  song-uuid : 'xxx-xxx-xxx-xxx',
  lyrics : [{
    label : [intro, verse, prechorus, chorus, bridge, flow/interlude, outro]
    order : [integer]
    content1 : [text]
    content2 : [text]
    hotkey : [character]
    backdrop-path : '',
    template-uuid : '',
  }, ...],
  arrangements : [intro1, verse1, chorus, verse2, chorus, bridge, chorus]
}
