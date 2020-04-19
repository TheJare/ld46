# Keep it Alive LD46

Move your little white ball and stay alive as long as you can. Things hurt you
if you touch them, and you also take damage if you move too long without recovering.

You can play the game at http://iguanademos.com/Jare/games/ld46/

## Details

An attempt at an entry to Ludum Dare #46. As usual, just a few hours
available to do something, but at least I cleaned up some old Typescript
gamedev bits I had.

As usualy, I tweeted my original design shortly after waking up and reading about the topic, **Keep it Alive**:

- reach the goal keeping a candle alive, avoiding drops or buckets of water thrown at you.
You also need to be careful how you move or the wind puts out the flame, but too slow and wax runs out.
- If I try this, my worst enemy will be spending way too long on the flame and / or water simulation
and rendering. On the other hand it may prove a nice bullethell-like experience.
- Touch controls. hold: candle moves slow to you. Drag: candle mimics with dash, reduces flame power
- Plot twist: when you reach the goal, you realize you're a pyromaniac and people were just trying to
stop you from burning a forest. Now go, play the next round and see what you will try to burn this time!

Right now things are spiritually similar to the tweet, but:

- There's no wax (fuel, really) no stages, and no plot twist. It's endless.
- Visuals are as basic as it gets: squares and circles. I draw two bars at the top showing your flame
strength (which peters out as you move) and your health.
- Multiple types of hazards.
- Simple controls. This is really about control and precision.

## Development

Install dependencies with `npm install`.

Build with `npm run watch`.

To get proper source maps in the browser, serve the repo folder, for example
`python -m http.serve 8080` then navigate to `http://localhost:8080/dist`.

Developed with Typescript 3.8.3.

Uses [almond js](https://github.com/requirejs/almond) for module support.

## License

This software is released under the MIT License

Copyright 2020 Javier Arévalo

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.