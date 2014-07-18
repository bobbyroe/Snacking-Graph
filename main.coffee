log = console.log.bind console 
width = window.innerWidth - 200
height = window.innerHeight - 60
sort_strings = ['Name', 'weight_in_g', 'Protein_in_g', 'Saturated_Fat_in_g', 'Sugar_in_g', 'Sodium_in_mg']
sort_string = 'Name'

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

snack_data = []
bar_height = 30
is_sorted_by_alpha = true
y = d3.scale.ordinal()
    .rangeRoundBands([-20, height], .1, 1)
d3.csv "data/Snack_Composition.csv", type, (error, data) ->

    snack_data = data
    scale = 4

    snack_data.sort((a, b) -> d3.ascending(a.Name, b.Name))
    y.domain( snack_data.map((d) -> d.Name) )

    log snack_data

    bar = svg.selectAll("g")
        .data(snack_data)
        .enter().append("g")
        .on('click', (d, i) -> log d)
        .attr("transform", (d, i) -> "translate(250, #{y(d.Name)})")

    # weight in g

    bar.append("rect")
        .style('stroke-width', '2px')
        .style('stroke', 'rgba(0, 98, 255, 0.8)')
        .attr("width", (data, i) -> data.weight_in_g * scale)
        .attr("height", bar_height - 1)

    # Protein in g

    bar.append("rect")
        .attr('class', 'protein')
        .attr("width", (data, i) -> data.Protein_in_g * scale)
        .attr("height", bar_height - 1)

    # sat. fat in g

    bar.append("rect")
        .attr('class', 'fat')
        .attr('x', (data, i) -> data.Protein_in_g * scale)
        .attr("width", (data, i) -> data.Saturated_Fat_in_g * scale)
        .attr("height", bar_height - 1)

    # # sugar in g

    bar.append("rect")
        .attr('class', 'sugar')
        .attr('x', (data, i) -> data.Protein_in_g * scale + data.Saturated_Fat_in_g * scale)
        .attr("width", (data, i) -> data.Sugar_in_g * scale)
        .attr("height", bar_height - 1)

    # # sodium in mg

    # bar.append("rect")
    #     .attr('class', 'sodium')
    #     .attr("y", bar_height - 12)
    #     .attr("width", (data, i) -> data.Sodium_in_mg * scale * .1)
    #     .attr("height", 2)

    bar.append("text")
        .attr('x', (data, i) -> data.weight_in_g * scale - 15)
        .attr("y", bar_height - 12)
        .text((d) -> "#{Math.round(d.weight_in_g)}g")

    bar.append("text")
        .attr('x', (data, i) -> -10)
        .attr("y", bar_height - 12)
        .style("text-anchor", "end")
        .text((d) -> d.Name)


update = ->
    fn = (a, b) -> d3.ascending(+a[sort_string], +b[sort_string]) # coerce to number
    if sort_string is 'Name'
        fn = (a, b) -> d3.ascending(a[sort_string], b[sort_string])
    y0 = y.domain( snack_data.sort(fn).map((d) -> d.Name) )
            .copy()

    transition = svg.transition().duration(500)
    transition.selectAll("g")
        .delay((d, i) -> i * 50)
        .attr("transform", (d, i) -> "translate(250, #{y0(d.Name)})")

type = (d) ->
  d.weight_in_g = +d.weight_in_g # coerce to number
  d.Protein_in_g = +d.Protein_in_g # coerce to number
  d.Sugar_in_g = +d.Sugar_in_g # coerce to number
  d.Saturated_Fat_in_g = +d.Saturated_Fat_in_g # coerce to number
  d

onKeyDown = (evt) ->
    SPACE = 32
    A = 65
    Z = 90
    key_pressed = evt.keyCode
    if key_pressed is SPACE
        sort_string = if sort_string is 'Name' then 'weight_in_g' else 'Name'
        update()
    if key_pressed is A
        log 'A'

    # log key_pressed

onClick = (evt) ->
    target = evt.target.tagName
    class_name = evt.target.className

    if target is 'LI'
        if class_name is 'protein' then sort_string = 'Protein_in_g'
        if class_name is 'fat' then sort_string = 'Saturated_Fat_in_g'
        if class_name is 'sugar' then sort_string = 'Sugar_in_g'
        if class_name is 'sodium' then sort_string = 'Sodium_in_mg'
        update()
    # log target, class_name

document.addEventListener 'keydown', onKeyDown
document.body.addEventListener 'click', onClick

