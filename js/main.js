var log = console.log.bind(console);
var width = window.innerWidth;
var height = window.innerHeight;
var radius = Math.min(width, height) / 2;
var sort_string = 'Name';
var fill_lightness = d3.scale.linear().range([0.3, 1]);
// var stroke_lightness = d3.scale.linear().range([0.3, 0.8]);
var fill_hue = d3.scale.linear().range([0, 120]);
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
var scale = 1;
var snack_data = [];

function init () {

    snack_data.forEach( function (s) {
        log(s.name, s);
    });

    fill_lightness.domain([
        d3.min(snack_data, function(d) {
            return +d.sugars_in_g;
        }), d3.max(snack_data, function(d) {
            return +d.sugars_in_g;
        })
    ]);

    // stroke_lightness.domain([
    //     d3.min(snack_data, function(d) {
    //         return +d.sodium_in_mg;
    //     }), d3.max(snack_data, function(d) {
    //         return +d.sodium_in_mg;
    //     })
    // ]);

    fill_hue.domain([
        d3.min(snack_data, function(d) {
            return +d.grade;
        }), d3.max(snack_data, function(d) {
            return +d.grade;
        })
    ]);

    var force = d3.layout.force()
        .nodes(snack_data)
        .links([])
        .charge(function(d) {
            return d.weight_in_g * -12;
        }).linkDistance(0)
        .size([width, height]);

    var gs = svg.selectAll('g')
        .data(snack_data)
        .enter()
        .append('g')
        .attr("transform", function(d, i) {
            return "translate( " + (Math.random() * width) + "," + (Math.random() * height) + ")";
        }).call(force.drag);

    var circle = gs.append('circle')
        .attr('r', function(d) {
            return d.weight_in_g * scale;
        }).attr('fill', function(d) {
            return d3.hsl(fill_hue(d.grade), 1.0, 0.3);
        });
        // .attr("stroke", function(d) {
        //     return d3.hsl(fill_hue(d.grade), 1.0, 0.3);
        // }).attr('stroke-width', function(d) {
        //     return d.grade;
        // });

    var text = gs.append('text')
        .attr("text-anchor", "middle")
        .attr('fill', '#e0e0e0')
        .text(function(d, i) {
            return d.name;
        }).attr('dx', function(d, i) {
            return 0;
        }).attr('dy', function(d, i) {
            return 10;
        }).style('font-size', '12px');

    var brand_text = gs.append('text')
        .attr("text-anchor", "middle")
        .attr('fill', 'rgba(255, 255, 255, 0.4')
        .text(function(d, i) {
            return d.brand_name;
        }).attr('dy', function(d, i) {
            return -10;
        }).style('font-size', '24px');

    force.on("tick", function() {
        return svg.selectAll('g').attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });

    force.start();
};

function update() {

    // more is good
    fill_hue.domain([
        d3.min(snack_data, function(d) {
            return +d[sort_string];
        }), d3.max(snack_data, function(d) {
            return +d[sort_string];
        })
    ]);

    // less is good
    if (sort_string === 'saturated_fat_in_g' ||
        sort_string === 'sugars_in_g' ||
        sort_string === 'sodium_in_mg' ||
        sort_string === 'total_carbohydrate_in_g' || 
        sort_string === 'calories_in_Kcal') {
        fill_hue.domain([
            d3.max(snack_data, function(d) {
                return +d[sort_string];
            }), d3.min(snack_data, function(d) {
                return +d[sort_string];
            })
        ]);
    }
    var transition = svg.transition().duration(500);

    transition.selectAll("g").select('circle').delay(function(d, i) {
        return i * 50;
    }).attr('fill', function(d) {
        return d3.hsl(fill_hue(d[sort_string]), 1.0, 0.3);
    });
}

function onClick(evt) {

    var target = evt.target.tagName;
    var class_name = evt.target.className;
    if (target === 'LI') {
        if (class_name === 'protein') sort_string = 'protein_in_g';
        
        if (class_name === 'fat') sort_string = 'saturated_fat_in_g';
        
        if (class_name === 'sugar') sort_string = 'sugars_in_g';
        
        if (class_name === 'sodium') sort_string = 'sodium_in_mg';
        
        if (class_name === 'grade') sort_string = 'grade';
        
        if (class_name === 'carbs') sort_string = 'total_carbohydrate_in_g';

        if (class_name === 'fiber') sort_string = 'dietary_fiber_in_g';        

        if (class_name === 'calories') sort_string = 'calories_in_Kcal';
        update();
    }
}
document.body.addEventListener('click', onClick);


var data_files = ["baked_ruffles_cheddar.js", "blue_diamond_almonds.js", "blue_diamond_smokehouse.js",
    "blue_diamond_wasabi_soy.js", "cheddar_sunchips.js", "chex_mix_traditiaonal.js",
    "fuji_apple.js", "goodness_knows_cranberry.js", "kind_bar_almonds_Apricots.js",
    "kind_bar_nutssea_salt.js", "kirkland_trail_mix.js", "krave_beef_jerky_chili_lime.js", "nature_vally_oats_n_honey.js",
    "nature_vally_protein_chewy_peanut.js", "natures_path_macaroon_crunch.js", "oberto_beef_jerky.js",
    "odwalla_chocolate_peanut_butter_bar.js", "planters_cashews.js", "popchips_bbq.js", "popchips_plain.js",
    "rice_krispie_treats.js", "sunchips_salsa.js", "treetop_fruit_snacks.js", 'Clif_Builder_bar.js', "Kirkland_Seaweed.js",
    "SheilaG_Brownie_Brittle.js", "Snack_Factory_Pretzel_chips.js", "banana.js", "famous_amos_cookies.js",
    "pringles_sour_cream_onion.js", "tims_salt_and_vinegar_chips.js", "bugles.js",
    "corn_nuts_orig.js", "lays_plain.js", "popcornopolis_buttered_up.js",
    "sour_cream_pringles.js"
];

data_files.forEach( function (file) {
    d3.json("data/" + file, function (err, data) {
        if (err != null) { log(file, err); } else { stokeSnack(data); } 
    });
});
var data_loaded_counter = 0;
function stokeSnack (data) {
    var snack_processed = processSnack(data);
    snack_data.push(snack_processed);
    data_loaded_counter += 1;
    if (data_loaded_counter === data_files.length) {
        init();
    }
}

function processSnack (data) {
    
    //
    // add error checking
    //

    var brand_name = (data['@attributes'].brand != null) ? data['@attributes'].brand : '';
    var snack = {};
    data.object_nutrient_list.object_nutrients.forEach( function (attr) {
        var attr_name = attr.nutrient['@attributes'].name + '_in_' +  attr.nutrient['@attributes'].uom;
        snack[attr_name] = +attr['@attributes'].value;
    });
    snack.brand_name = brand_name;
    snack.name = data['@attributes'].name;
    snack.grade = data.grade['@attributes'].score;
    snack.weight_in_g = +data.serving['@attributes'].size_metric || 10;

    return snack;
};





