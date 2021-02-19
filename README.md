# note-share
Firefox wepage annotation and sharing

## Thorns in my side
The URL for a given website is not always an identifier for a specific
appearance or HTML layout. For example, a react application might use the
single endpoint "/" and just have a metric shit-ton of AJAX that gets data that
is _not_ idempotent to generate the content. Looking at you reddit...

But even sites that are more straight forward aren't always perfect. Hackernew
uses the `id` query parameter to define a comments section. Whereas the RESTful
endpoint would be a unuqie resource identifier, who cares about REST amirite?

Anyway, there's going to need to be some amount of configuration to allow for
this type of chicanery. In some cases it will be impossible to create a useful
way to add notes. Reddit comment sections are a great example. They are ordered
by something that is specific to the application
(upvote/downvotes/new/controversial) which I would need to recapitulate in
order to know the ordering, or be able to tie an actual identifier to. This is
not feesible.

Instead, I think that restricting the notion of what this is for is a better
approach. That is, this is really for things like blogs, guides, and in general
static sites that are rich in information that you might want to annotate, but
which is also uniquely tied to the URL where it is found.

Current functionality:
<img src="https://media.giphy.com/media/xCUlHtAkG0Zs92nucB/giphy.gif" width="300">
