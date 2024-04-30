// Question 1

// Part 1
//  Write a CRUD operation(s) that inserts the following new records into the collection
db.collection.insertMany([
    {
        "_id" : 20,
        "name" : {
            "first" : "Alex",
            "last" : "Chen"
        },
        "birth" : ISODate("1933-08-27T04:00:00Z"),
        "death" : ISODate("1984-11-07T04:00:00Z"),
        "contribs" : [
            "C++",
            "Simula"
        ],
        "awards" : [
            {
                "award" : "WPI Award",
                "year" : 1977,
                "by" : "WPI"
            }
        ]
    },
    {
        "_id" : 30,
        "name" : {
            "first" : "David",
            "last" : "Mark"
        },
        "birth" : ISODate("1911-04-12T04:00:00Z"),
        "death" : ISODate("2000-11-07T04:00:00Z"),
        "contribs" : [
            "C++",
            "FP",
            "Lisp",
        ],
        "awards" : [
            {
                "award" : "WPI Award",
                "year" : 1963,
                "by" : "WPI"
            },
            {
                "award" : "Turing Award",
                "year" : 1966,
                "by" : "ACM"
            }
        ]
    }
])

// Part 2
//  Report all documents of people who got less than 3 awards or have contribution in “FP”
db.collection.aggregate([{
    $match: {
        $or: [
            // Include people who got 0 awards (AKA don't have "awards" field)
            { "awards": { $exists: false } },
             // Include docs with < 3 awards
            { $expr: { $lt: [{ $size: "$awards" }, 3] } },
            // Include people that have a contribution in "FP"
            { "contribs": "FP" } ]
    }
}])

// Part 3
//  Insert a new field of type array, called “comments”, into the document of “Alex Chen” storing the
//   following comments: “He taught in 3 universities”, “died from cancer”, “lived in CA”

db.collection.update({
    // Get doc of "Alex Chen"
    "name.first": "Alex",
    "name.last": "Chen"
},
{
    // Set new comments field of type array with 3 comments
    $set: {
        comments: [
            "He taught in 3 universities",
            "died from cancer",
            "lived in CA"
        ]
    }
})

// Part 4
//  For each contribution by “Alex Chen”, say X, list the peoples’ names (first and last) who have
//   contribution X.
db.collection.aggregate([
    // Get doc of "Alex Chen"
    {
        $match: {
            "name.first": "Alex",
            "name.last": "Chen"
        }
    },
    // Get Alex's contribs
    {
        $unwind: {
            path: "$contribs"
        }
    },
    // Group by contrib and push Alex first & last name
    {
        $group: {
            _id: "$contribs",
            init_person: {
                $push: {
                    first: "$name.first",
                    last: "$name.last"
                }
            }
        }
    },
    // Include other ppl with same contrib (+ make sure no duplicate Alex)
    {
        $lookup: {
            from: "collection",
            let: {
                contribution: "$_id"
            },
        pipeline: [
            {
                // Get ppl with same contrib as Alex
                $match: {
                    $expr: {
                        $in: [
                            "$$contribution",
                            "$contribs"
                        ]
                    }
                }
            },
            {
                // Only get ppl that are not Alex Chen
                $match: {
                    "name.first": {
                        $ne: "Alex"
                    },
                    "name.last": {
                        $ne: "Chen"
                    }
                }
            },
            {
                // Project first & last name
                $project: {
                    _id: 0,
                    first: "$name.first",
                    last: "$name.last"
                }
            }
        ],
        as: "other_people"
        }
    },
    // Project output in "Contribution": ... "People": ... format for each contrib
    {
        $project: {
            _id: 0,
            Contribution: "$_id",
            People: {
                $concatArrays: [
                    "$init_person",
                    "$other_people"
                ]
            }
        }
    }
])

// Part 5
//  Report the distinct organization that gave awards. This information can be found in the “by” field
//   inside the “awards” array.The output should be an array of the distinct values, e.g., [“wpi’, “acm’, ...]
db.collection.aggregate([
  // Unwind the awards array
    {
        $unwind: "$awards"
    },
    // Group by the "by" field to get distinct orgs
    {
        $group: {
            _id: "$awards.by"
        }
    },
    // Project org names
    {
        $project: {
            _id: 0,
            organization: "$_id"
        }
    }
])
