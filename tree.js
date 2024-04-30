// Question 3

// Part 1
//  Assume we model the records and relationships in Figure 1 using the Parent-Referencing model (Slide 4 in
//   MongoDB-4).
db.categories.insert({ _id: "MongoDB", parent: "Databases"})
db.categories.insert({ _id: "dbm", parent: "Databases"})
db.categories.insert({ _id: "Databases", parent: "Programming"})
db.categories.insert({ _id: "Languages", parent: "Programming"})
db.categories.insert({ _id: "Programming", parent: "Books"})
db.categories.insert({ _id: "Books", parent: null })

//  Write a query to report the ancestors of “MongoDB”.
//  The output should be an array containing values:
//   [{ Name: “Databases”, Level: 1},
//    {Name: “Programming”, Level: 2},
//    {Name: “Books”, Level: 3}]
//  Note: “Level” is the distance from “MongoDB” node to the other node. It should be computed in your code
function getAncestors(leafID) {
    // Find current based on ID
    let current = db.categories.findOne({ _id: leafID });

    // If current doesn't exist, return null
    if (!current) {
        return null;
    }

    // Create array to store ancestors
    let ancestors = [];
    // Set current level
    let level = 1;

    // Go through the tree until we reach the root
    while (current.parent !== null) {
        // Add current to ancestors array
        ancestors.unshift({ Name: current.parent, Level: level++ });

        // Find parent node of current to keep moving through tree
        current = db.categories.findOne({ _id: current.parent });
    }

    // Return ancestors
    return ancestors;
}

// Run getAncestors with leafID = "MongoDB"
let result = getAncestors("MongoDB");
printjson(result);



// Part 2
//  You are given only the root node, i.e., _id = “Books”, write a query that reports the height of the tree.
//   (It should be 4 in our case).
function getTreeHeight(rootID) {
    // Find root based on ID
    var root = db.categories.findOne({ _id: rootID });

    // If root doesn't exist, return null
    if (!root) {
        return null;
    }

    // Create stack
    var stack = [];
    // Set current height
    var height = 0;

    // Push root level
    stack.push({ node: root, level: 1 });

    // While there's still stuff in the stack...
    while (stack.length > 0) {
        // Pop to get current
        var current = stack.pop();

        // Find children of current (AKA who has current as parent)
        var children = db.categories.find({ parent: current.node._id });

        // While more children exist...
        while (children.hasNext()) {
            // Set current child to next child
            var child = children.next();

            // Push child to stack
            stack.push({ node: child, level: current.level + 1 });

            // Calculate height
            height = Math.max(height, current.level + 1);
        }
    }

    // Return height
    return height;
}

// Run getTreeHeight with rootID = "Books"
var result2 = getTreeHeight("Books");
printjson(result2);



// Part 3
//  Assume we model the records and relationships in Figure 1 using the Child-Referencing model.
db.categories2.insert({ _id: "MongoDB", children: [] })
db.categories2.insert({ _id: "dbm", children: [] })
db.categories2.insert({ _id: "Databases", children: ["MongoDB", "dbm"] })
db.categories2.insert({ _id: "Languages", children: [] })
db.categories2.insert({ _id: "Programming", children: ["Databases", "Languages"] })
db.categories2.insert({ _id: "Books", children: ["Programming"] })

//  Write a query to report the descendants of “Books”. The output should be an array containing
//   values [“Programming”, “Languages”, “Databases”, “MongoDB”, “dbm”]
function getDescendants(rootID) {
    // Find root based on ID
    var root = db.categories2.findOne({ _id: rootID });

    // If root doesn't exist, return null
    if (!root) {
        return null;
    }

    // Create array to store descendants
    var descendants = [];
    // Create stack
    var stack = [];
    
    // Push root
    stack.push(root);

    // While there's still stuff in the stack...
    while (stack.length > 0) {
        // Pop to get current
        var current = stack.pop();
        // Find children of current
        var children = db.categories2.findOne({ _id: current._id }).children;

        // While more children exist...
        if (children.length > 0) {
            // Add children to descendants
            descendants = descendants.concat(children);
            // For each child...
            children.forEach(function (child) {
                // Push onto stack
                stack.push({ _id: child });
            });
        }
    }

    // Return descendants
    return descendants;
}

// Run getDescendants with rootID = "Books"
var result3 = getDescendants("Books");
printjson(result3);
