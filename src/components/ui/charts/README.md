# Charts for the Superpower data page

The goal is to make the charts as accessible as possible while using as little external dependencies as possible.
Why?

- External dependencies often come with a ton of unnecessary additional dependencies, such as third party loaders / modules which aren't needed
- They are often not customizable, our design requirements are heavy and we need custom solutions anyway
- They sometimes don't render in all browsers and focus on mathematical correctness instead of easy information gathering
- We want something extentable, some big chart libraries aren't maintained well enough

### How the charts are maintainable

Each bigger chart has a config file. In this config file there are different values hardcoded which align on the current desgin system. If one of them needs to be updated, feel free to play around with it, most of the variables get used to calculate dynamic widths, heights or to connect points in between.

If this isn't enough in rare cases and charts need to be updated directly, you can find the business logic inside of the specific chart hooks. The main component always assembles the SVG based on that business logic.

### Why using SVGs and not a canvas renderer or plain divs?

Please try to do it with native SVG. SVG's are powerful because they are simple, can we broken into different parts, are mathematically calculatable, and have support across all devices, including a bunch of other programming language, especially mobile devices.

The HTML is performant, yet it is pixel-based. An additional library is required to make it easier to calculate different charts. Using HTML elements directly is stupid as it is insanely unperformant and makes the bundle sizes much much bigger.
