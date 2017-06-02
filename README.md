Canvas Feedback
===============

_Rated "T" for "trippy"_

Canvas Feedback is an application of an analogue-video-like feedback effect
to an HTML5 canvas element.

You can see and play with online here:
[Canvas Feedback installation at Cat's Eye Technologies](http://catseye.tc/installation/Canvas_Feedback).

A [stripped-down version](impl/canvas-feedback-1k/canvas-feedback-1k.js),
949 bytes long, was submitted to [JS1K 2015](http://js1k.com/2015-hypetrain/),
which you can see and play with here:
[Canvas Feedback 1K Entry Page](http://js1k.com/2015-hypetrain/demo/2229).

Background
----------

The idea came about while discussing Nam June Paik, and video art in
general, with Gareth Jackson.

It was noted by one of us that, before digital video technology, there were
a number of analogue effects that were employed in video art that aren't
seen as frequently these days.  A notable one was the use of feedback,
simplest version being training a camera on a monitor that is displaying
the feed from that same camera.  More sophisticated applications are
of course possible; a relatively famous example is the 1970's version of
the Doctor Who title sequence.

The question arose: could something analogous could be done with digital
video, and if so, how?

And I came up with this as a simple technique which is similar to video
feedback and which can be implemented straightforwardly in an HTML5
canvas element.

The default image used when Canvas Feedback starts up was designed by
Gareth Jackson specifically to be a pleasing subject for this feedback process.

Theory of Operation
-------------------

*   Load an initial image into the canvas.
*   Copy the image on the canvas into a buffer, rotate it around
    its centre _r_ degrees, scale it in the X and/or Y dimension, then
    paste that result back onto the canvas.
*   Increase _r_ by a small amount and repeat the process from the second
    step.

Rotation and scaling are both optional.  It works best if the amount of
rotation and scaling at each step is kept small, as it will be amplified
greatly by the feedback.

Notes
-----

It should be noted that this is only a convenient approximation of how
analogue video feedback methods tend to work.

Most rely on there being _continuous input_ to the feedback process; for
example, a running camera that is introducing ever more frames.  The Doctor Who
title sequence, for example, seems to be "loaded" with video information from
the edges of the screen (although I admit I don't know the details of how it
works.)

This mechanism does not do that; the video information in each successive
step comes only from the previous step.  One result of this is that it will
eventually "run out" of information and come to a fixed point (usually with
the entire canvas being a single colour, or an unmoving series of concentric
rings or discs of colour.)

License
-------

Distributed under an MIT license.  See [LICENSE](LICENSE) for full information.

History
-------

* version 1.0: Initial release.
* version 1.0-2015.0826: added the JS1K version to this repo.
* version 1.1: Allowed the parameters to be configured by querystring args.
