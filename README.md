# Doug's Adventure
A 2D JavaScript RPG/Adventure web game.

<br>

## 🔗 Demo link:
Play at [https://krobison10.github.io/dougs-adventure/](https://krobison10.github.io/dougs-adventure/) now!

<br>

## 📃 Table of Contents:

- [About The Game](#-about-the-game)
- [Trailer](#-trailer)
- [Technologies](#-technologies)
- [Setup](#%EF%B8%8F-setup)
- [Approach](#-approach)
- [Status](#-status)
- [Credits](#credits)

<br>

## 🌲 About The Game

Doug's Adventure was developed for the course "Game and Simulation Design" (formerly named "Computational Worlds") instructed by Dr. Chris Marriott at the University of Washington Tacoma. Students worked in mostly self-formed groups starting with a minimal empty game engine written in JavaScript.

Doug's Adventure is a 2D RPG/Adventure game where Doug, the main character, gets plopped into a strange world. Doug finds himself in a situation where he must try to find better items and weapons to deafeat stronger and stronger enemies. There are 3 bosses in the game, the game is beaten when the final boss is defeated. There are other dynamic events in the game, such as nightime, where some different enemies can spawn, and the blood moon where many more enemies can spawn.

The game is fully featured with melee, ranged, and magical weapons. Consumable items, such as healing potions and arrows. On top of that, there is a dynamic lighting system and a particle system, with many particles themselves using the dynamic lighting to enhance their appearance.

<br>

## 🎥 Trailer

Click the image to view the trailer on youtube. ~2 mins

[![IMAGE_ALT](https://img.youtube.com/vi/Kpqv8-0Jmtw/maxresdefault.jpg	)](https://www.youtube.com/watch?v=Kpqv8-0Jmtw)


<br>

## 💻 Technologies

<img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" alt="JavaScript Logo" width="65" height="65"/><img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original.svg" alt="HTML5 Logo" width="65" height="65"/><img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-original.svg" alt="CSS3 Logo" width="65" height="65"/>

`JavaScript` `HTML5` `CSS3`

<br>

## 🛠️ Setup
1. Download or clone the repository.
1. Test locally with live server plugin of your choice.
1. That's it! Tt's really that easy.

<br>

## 🤓 Approach

Development began with our instructor's empty game engine which was "happily modified from Googler Seth Ladd's 'Bad Aliens' game and his Google IO talk in 2011". In its stage then, it only possessed basic functions, like the update render loop. Kyler began working on it mid December 2022 and by the start of the course and group formation, the game possessed a lighting system, player movement, animation, and camera following. 

A few changes were made to the game engine. Firstly, the entity system was separated into layers. Initially, this was done so that entities in the foreground layer could be sorted, so that entities "farther" away would be drawn behind "closer" ones. Eventually, this layer system proved helpful for optimization, as certain layers, like the ground layer, didn't ever need updating, and the engine could cheaply skip over the updates of those entities. 

Effort was also made to use, but not overuse, inheritance. There was an entity class from which all entities inherited from. It possessed helpful functions like `getCenter()` that would return the postiion of the center of the entity using its position (top-left based) and size, and `getScreenPos()` which returned the position on the screen as opposed to the true game position. This approach was acceptable, but in hindsight, it may have been better to use composition relationships instead of inheritance.

<br>

## 📈 Status
Doug's Adventure is shelved for now, but work may continue in the future.

<br>

## Credits
List of contriubutors:
- Kyler Robison
- Cam Lempitsky
- Ryan MacLeod
- Alay Kidane
