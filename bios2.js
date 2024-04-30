// Question 2

// Part 1
//  Write an aggregation query that group by the award name, i.e., the “award” field inside the “awards”
//   array and reports the count of each award.
db.collection.aggregate([
  // Unwind the awards array
    {
        $unwind: "$awards"
    },
    // Group by the "award" field & count number each award
    {
        $group: {
            _id: "$awards.award",
            // Count number of each award
            count: {
                $sum: 1
            }
        }
    },
    // Project award name & count
    {
        $project: {
            _id: 0,
            award: "$_id",
            count: 1
        }
    }
])

// Part 2
//  Write an aggregation query that groups by the birth year, i.e., the year within the “birth” field, and
//   report an array of _ids for each birth year.
db.collection.aggregate([
    // Get birth year
    {
        $project: {
            birth_year: {
                $year: "$birth"
            },
            _id: 1
        }
    },
    // Group by birth year and get _ids in array
    {
        $group: {
            _id: "$birth_year",
            ids: {
                $push: "$_id"
            }
        }
    },
    // Project birth year & ids
    {
        $project: {
            _id: 0,
            birth_year: "$_id",
            ids: 1
        }
    }
])

// Part 3
//  Write an aggregation query that groups by the award’s year (which is found inside the awards array),
//   and for each year, report the count of people who received awards in this year.
db.collection.aggregate([
    // Unwind the awards array
    {
        $unwind: "$awards"
    },
    // Group by the "year" field & count number each award in that year
    {
        $group: {
            _id: "$awards.year",
            // Count number of each award
            count: {
                $sum: 1
            }
        }
    },
    // Project award year & count
    {
        $project: {
            _id: 0,
            award: "$_id",
            count: 1
        }
    }
])