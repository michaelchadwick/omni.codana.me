(function ($) {
  function create_site(v, $article, cl = '') {
    // create anchor
    var anchor = document.createElement('a')
    anchor.name = v.name.replace(/\s/g, '').toLowerCase()
    $article.append(anchor)

    // create section
    var section = document.createElement('section')
    section.id = `site-${v.name.replace(/\s/g, '').toLowerCase()}`
    if (cl !== '') section.classList.add(cl)
    var section_inner = document.createElement('div')
    section_inner.classList.add('site-inner')

    var site_header = document.createElement('h2')
    site_header.classList.add('site-header')
    if (cl !== '') site_header.classList.add(cl)
    site_header.innerHTML = v.name

    var site_blurb = document.createElement('h3')
    site_blurb.classList.add('site-blurb')
    if (cl !== '') site_blurb.classList.add(cl)
    site_blurb.innerHTML = v.blurb

    var site_tech = document.createElement('h4')
    site_tech.classList.add('site-tech')
    if (cl !== '') site_tech.classList.add(cl)
    site_tech.innerHTML = v.tech

    var site_link = document.createElement('h5')
    site_link.classList.add('site-link')
    var site_link_anchor = document.createElement('a')
    site_link_anchor.href = v.url
    site_link_anchor.innerHTML = v.url
    site_link_anchor.target = '_blank'

    site_link.append(site_link_anchor)

    var site_iframe_frame = document.createElement('div')
    site_iframe_frame.classList.add('iframe-frame')
    var site_iframe = document.createElement('iframe')
    site_iframe.id = `iframe-${v.name.replace(/\s/g, '').toLowerCase()}`
    site_iframe.setAttribute('src', v.url)
    site_iframe.height = '300'

    site_iframe_frame.append(site_iframe)

    if (site_iframe.contentWindow) {
      site_iframe.contentWindow.console.log = function() { /* nop */ };
    }

    section_inner.append(site_header)
    section_inner.append(site_blurb)
    section_inner.append(site_tech)
    section_inner.append(site_link)
    section_inner.append(site_iframe_frame)

    section.append(section_inner)

    $article.append(section)
  }

  // pull site creation data
  $.getJSON('assets/json/sites.json')
    .success(function (data) {
      var $current = $('article#sites-current')
      var $archived = $('article#sites-archived')

      $current.html('')
      $archived.html('')

      var article_height = 0
      // <article id='sites-current'>
      $.each(data.current, (k, v) => {
        create_site(v, $current);
        article_height += 350
      })
      // </article>

      // <article id='sites-archived'>
      $.each(data.archived, (k, v) => {
        create_site(v, $archived, 'archived')
      })
      // </article>

      // figure out height of <article>
      var height_mod = 0.584;
      height_mod = 0.615;
      $current.height(article_height * height_mod)
    })
    .error(function (e) {
      if (e.status === 404) {
        $sites.html('<p>Error: json/sites.json is missing</p>')
      } else {
        $sites.html('<p>Error: json/sites.json is malformed</p>')
        $sites.append(`<textarea id='json' style='border: 1px solid #000; font-family: Consolas; height: 200px; width: 500px;'>${e.responseText}</textarea>`)
      }
    })

  // lazy load sites
  $('section iframe').recliner({
    attrib: 'data-src', // selector for attribute containing the media src
    throttle: 300, // millisecond interval at which to process events
    threshold: 100, // scroll distance from element before its loaded
    live: true // auto bind lazy loading to ajax loaded elements
  })
}($));
