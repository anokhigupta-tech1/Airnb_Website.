const Listing=require("../model/listing.js")

module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
}
module.exports.newRender=(req, res) => {
 
   res.render("listing/new.ejs");
}
module.exports.addNew=async (req, res) => {
  let url=req.file.path;
  let filename=req.file.filename;

  // console.log(url);
  // console.log(filename);
  const newListing = new Listing(req.body.listing);
  newListing.image={
    url,filename
  }
  newListing.owner=req.user._id;

  await newListing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect(`/listings/${newListing._id}`);
}
module.exports.editListing=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
   res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listing/edit.ejs", { listing,originalImageUrl });}

module.exports.showOne=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
}
module.exports.UpdateListing=async (req, res) => {
  const { id } = req.params;
   let url=req.file.path;
  let filename=req.file.filename;
  // 
  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true, runValidators: true }
  );
  if(req.file){
    updatedListing.image={
      url,
      filename
    }
    await updatedListing.save();
  }
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}