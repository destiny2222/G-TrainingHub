import React, { useState, useEffect } from "react";
import "./Settings.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrg,
  updateOrg,
} from "../../../../redux/slices/admin_organisation/organisationSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

function Settings() {
  const dispatch = useDispatch();
  const organization = useSelector((state) => state.org.organization);
  const orgStatus = useSelector((state) => state.org.status);
  const isLoading = orgStatus === "loading";
  const [isSaving, setIsSaving] = useState(false);
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const [formData, setFormData] = useState({
    name: organization?.name || "",
    subscription_plan: organization?.subscription_plan || "",
    subscription_status: organization?.subscription_status || "",
    id: organization?.id || "",
    // contact_email: organization?.users?.[0]?.email || '',
    rc_number: organization?.rc_number || "",
    sector: organization?.sector || "",
    employee_count: organization?.employee_count || "",
    training_focus_area: organization?.training_focus_area || "",
    contact_person_name: organization?.contact_person_name || "",
    official_email: organization?.official_email || "",
    company_logo_path_thumbnail:
      organization?.company_logo_path_thumbnail || "",
    address: organization?.address || "",
    training_mode: organization?.training_mode || "",
  });

  const [logo, setLogo] = useState(formData.company_logo_path_thumbnail);
  const [logoUrl, setLogoUrl] = useState(
    formData.company_logo_path_thumbnail || "",
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    dispatch(fetchOrg());
  }, [dispatch]);

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization?.name || "",
        subscription_plan: organization?.subscription_plan || "",
        subscription_status: organization?.subscription_status || "",
        id: organization?.id || "",
        // contact_email: organization?.users?.[0]?.email || '',
        rc_number: organization?.rc_number || "",
        sector: organization?.sector || "",
        employee_count: organization?.employee_count || "",
        training_focus_area: organization?.training_focus_area || "",
        contact_person_name: organization?.contact_person_name || "",
        official_email: organization?.official_email || "",
        company_logo_path_thumbnail:
          organization?.company_logo_path_thumbnail || "",
        address: organization?.address || "",
        training_mode: organization?.training_mode || "",
      });
      setLogo(organization?.company_logo_path_thumbnail || null);
      setLogoUrl(organization?.company_logo_path_thumbnail || "");
    }
  }, [organization]);

  const uploadLogoToCloudinary = async (file) => {
    try {
      setIsUploadingLogo(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset); // 👈 your preset name
      data.append("folder", "organizations/logos");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        },
      );

      const json = await res.json();

      if (json.secure_url) {
        setLogoUrl(json.secure_url);

        setFormData((prev) => ({
          ...prev,
          company_logo_path_thumbnail: json.secure_url, // save URL in formData
        }));

        toast.success("Logo uploaded successfully");
      } else {
        // console.error(json);
        toast.error("Failed to upload logo");
      }
    } catch (err) {
      // console.error(err);
      toast.error("An error occurred while uploading logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // local preview
      setLogo(URL.createObjectURL(file));
      // upload to Cloudinary
      uploadLogoToCloudinary(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanySave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        company_logo_path_thumbnail:
          logoUrl || formData.company_logo_path_thumbnail || "",
      };

      const response = await dispatch(
        updateOrg({
          orgSlug: formData.id,
          updatedData: payload, // plain JSON
        }),
      ).unwrap();

      if (response.status === "success") {
        toast.success(
          response.message || "Organization updated successfully..",
        );
        dispatch(fetchOrg());
    }, [dispatch]);

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization?.name || '',
                subscription_plan: organization?.subscription_plan || '',
                subscription_status: organization?.subscription_status || '',
                id: organization?.id || '',
                // contact_email: organization?.users?.[0]?.email || '',
                rc_number: organization?.rc_number || '',
                sector: organization?.sector || '',
                employee_count: organization?.employee_count || '',
                training_focus_area: organization?.training_focus_area || '',
                contact_person_name: organization?.contact_person_name || '',
                official_email: organization?.official_email || '',
                company_logo_path_thumbnail: organization?.company_logo_path_thumbnail || '',
                address: organization?.address || '',
                training_mode: organization?.training_mode || '',
            });
            setLogo(organization?.company_logo_path_thumbnail || null);
            setLogoUrl(organization?.company_logo_path_thumbnail || '');
        }
    }, [organization]);

    const uploadLogoToCloudinary = async (file) => {
        try {
            setIsUploadingLogo(true);

            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', uploadPreset); // 👈 your preset name
            data.append('folder', 'organizations/logos');

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: data,
            });

            const json = await res.json();

            if (json.secure_url) {
                setLogoUrl(json.secure_url);

                setFormData((prev) => ({
                    ...prev,
                    company_logo_path_thumbnail: json.secure_url, // save URL in formData
                }));

                toast.success('Logo uploaded successfully');
            } else {
                // console.error(json);
                toast.error('Failed to upload logo');
            }
        } catch (err) {
            // console.error(err);
            toast.error('An error occurred while uploading logo');
        } finally {
            setIsUploadingLogo(false);
        }
    };


    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // local preview
            setLogo(URL.createObjectURL(file));
            // upload to Cloudinary
            uploadLogoToCloudinary(file);
        }
    };




    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCompanySave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        

        try {
            const payload = {
                ...formData,
                company_logo_path_thumbnail: logoUrl || formData.company_logo_path_thumbnail || '',
            };

            const response = await dispatch(
                updateOrg({
                    orgSlug: formData.id,
                    updatedData: payload,    // plain JSON
                })
            ).unwrap();

            if (response.status === "success") {
                toast.success(response.message || "Organization updated successfully..");
                await dispatch(fetchOrg());
            } else {
                toast.error(response.message || "Failed to update organization.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "An error Occurred");
        } finally {
            setIsSaving(false);
        }
    };




    return (
        <div className="container py-4">
            {/* Company Information Section */}
            <form className="bg-white rounded-4 shadow-lg p-4 mb-5" onSubmit={handleCompanySave} style={{ maxWidth: '1100px', margin: '0 auto', border: '1px solid #e3e6ef' }}>
                <div className="mb-3 border-bottom pb-2">
                    <h2 className="fw-bold" style={{ fontSize: '2rem' }}>Company Information</h2>
                    <p className="text-secondary mb-0">Update your company's information</p>
                </div>
                <div className="row g-4">
                    {/* Logo Section */}
                    <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
                        <span className="fw-semibold mb-2" style={{ fontSize: '1.1rem' }}>Company Logo</span>
                        {/* 🌟 Conditional rendering for Logo */}
                        {isLoading ? (
                            <Skeleton circle width={120} height={120} className="mb-2" />
                        ) : logo ? (
                            <>
                                <img src={logo} alt="Company Logo" className="rounded-circle border mb-2" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                {isUploadingLogo && <small className="text-muted">Uploading logo...</small>}
                            </>
                        ) : (
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border mb-2" style={{ width: '120px', height: '120px' }}>Logo</div>
                        )}
                        {/* Conditional rendering for 'Upload Logo' link */}
                        {isLoading ? (
                            <Skeleton width={100} height={20} />
                        ) : (
                            <label className="btn btn-link p-0" style={{ fontWeight: 500, color: '#2563eb' }}>
                                Upload Logo
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
                            </label>
                        )}
                    </div>

                    {/* Company Details Inputs */}
                    <div className="col-md-8">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <span className="fw-semibold mb-1 d-block">Company Name</span>
                                {/* 🌟 Conditional rendering for Input Field */}
                                {isLoading ? (
                                    <Skeleton height={48} className="rounded-3" />
                                ) : (
                                    <input type="text" className="form-control form-control-lg rounded-3" name="name" value={formData.name} onChange={handleInputChange} />
                                )}
                            </div>
                            <div className="col-md-6">
                                <span className="fw-semibold mb-1 d-block">Company Size</span>
                                {isLoading ? (
                                    <Skeleton height={48} className="rounded-3" />
                                ) : (
                                    <input type="text" className="form-control form-control-lg rounded-3" name="employee_count" value={formData.employee_count} onChange={handleInputChange} />
                                )}
                            </div>
                            <div className="col-md-6">
                                <span className="fw-semibold mb-1 d-block">Industry</span>
                                {isLoading ? (
                                    <Skeleton height={48} className="rounded-3" />
                                ) : (
                                    <input type="text" className="form-control form-control-lg rounded-3" name="sector" value={formData.sector} onChange={handleInputChange} />
                                )}
                            </div>
                            <div className="col-md-6">
                                <span className="fw-semibold mb-1 d-block">RC Number</span>
                                {isLoading ? (
                                    <Skeleton height={48} className="rounded-3" />
                                ) : (
                                    <input type="text" className="form-control form-control-lg rounded-3" readOnly name="rc_number" value={formData.rc_number} onChange={handleInputChange} />
                                )}
                            </div>
                            <div className="col-md-12">
                                <span className="fw-semibold mb-1 d-block">Address</span>
                                {isLoading ? (
                                    <Skeleton height={48} className="rounded-3" />
                                ) : (
                                    <input type="text" className="form-control form-control-lg rounded-3" name="address" value={formData.address} onChange={handleInputChange} />
                                )}
                            </div>
                            <div className="col-md-6">
                                <span className="fw-semibold mb-1 d-block">Training Mode</span>
                                {isLoading ? (
                                    <Skeleton height={48} className="rounded-3" />
                                ) : (
                                    <input type="text" className="form-control form-control-lg rounded-3" name="training_mode" value={formData.training_mode} onChange={handleInputChange} />
                                )}
                            </div>
                            <div className="col-md-6">
                                <span className="fw-semibold mb-1 d-block">Training Focus Area</span>
                                {isLoading ? (
                                    <Skeleton height={48} className="rounded-3" />
                                ) : (
                                    <input type="text" className="form-control form-control-lg rounded-3" name="training_focus_area" value={formData.training_focus_area} onChange={handleInputChange} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row  mt-4">
                    <div className="col-lg-12 text-lg-end">
                        <button type="submit" className=" btn-sm btn-setting  rounded-3">
                            {isSaving ? (
                                <>
                                    <span className="spinner-border text-white spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </form>

    

            {/* Contact Details Section */}
            <form className="bg-white rounded-4 shadow-lg p-4 mb-5" onSubmit={handleCompanySave} style={{ maxWidth: '1000px', margin: '0 auto', border: '1px solid #e3e6ef' }}>
                <div className="mb-3 border-bottom pb-2">
                    <h2 className="fw-bold" style={{ fontSize: '2rem' }}>Contact Details</h2>
                    <p className="text-secondary mb-0">Update your contact information</p>
                </div>
                <div className="row g-4">
                    <div className="col-md-6">
                        <span className="fw-semibold mb-1 d-block">Primary Contact Person</span>
                        {isLoading ? (
                            <Skeleton height={48} className="rounded-3" />
                        ) : (
                            <input type="text" className="form-control form-control-lg rounded-3" name="contact_person_name" value={formData.contact_person_name} onChange={handleInputChange} />
                        )}
                    </div>
                    {/* <div className="col-md-4">
                        <span className="fw-semibold mb-1 d-block">Contact Email</span>
                        {isLoading ? (
                            <Skeleton height={48} className="rounded-3" />
                        ) : (
                            <input type="email" className="form-control form-control-lg rounded-3" name="contact_email" value="" onChange={handleInputChange} />
                        )}
                    </div> */}
                    <div className="col-md-6">
                        <span className="fw-semibold mb-1 d-block">Official Email</span>
                        {isLoading ? (
                            <Skeleton height={48} className="rounded-3" />
                        ) : (
                            <input type="email" className="form-control form-control-lg rounded-3" name="official_email" value={formData.official_email} onChange={handleInputChange} />
                        )}
                    </div>
                </div>
                <div className="row  mt-4">
                    <div className="col-lg-12 text-lg-end">
                        <button type="submit" className=" btn-sm btn-setting  rounded-3">Save Changes</button>
                    </div>
                </div>
            </form>
            {/* Subscription & Billing Section - Read-Only Data */}
            <div className="bg-white rounded-4 shadow-lg p-4 mb-5" style={{ maxWidth: '1000px', margin: '0 auto', border: '1px solid #e3e6ef' }}>
                <div className="mb-3 border-bottom pb-2">
                    <h2 className="fw-bold" style={{ fontSize: '2rem' }}>Subscription & Billing</h2>
                    <p className="text-secondary mb-0">Manage your plan and payment details.</p>
                </div>
                <div className="row g-4">
                    <div className="col-md-4">
                        <span className="fw-semibold mb-1 d-block">Current Plan</span>
                        <div className="fw-bold">
                            {isLoading ? <Skeleton width={150} /> : formData.subscription_plan || 'N/A'}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <span className="fw-semibold mb-1 d-block">Subscription Status</span>
                        {isLoading ? <Skeleton width={100} /> : <div>{formData.subscription_status || 'N/A'}</div>}
                    </div>
                    <div className="col-md-4">
                        <span className="fw-semibold mb-1 d-block">Billing Cycle</span>
                        {isLoading ? <Skeleton width={200} /> : <div>Next payment on Dec 25, 2024</div>}
                    </div>
                    <div className="col-md-4">
                        <span className="fw-semibold mb-1 d-block">Payment Method</span>
                        {isLoading ? <Skeleton width={100} /> : <div>Visa ending in 1234</div>}
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-4 gap-2">
                    <button type="button" className="btn btn-outline-primary btn-lg rounded-3">Upgrade Plan</button>
                    <button type="button" className="btn btn-outline-secondary btn-lg rounded-3">View Billing History</button>
                    <button type="button" className="btn btn-outline-success btn-lg rounded-3">Update Payment Method</button>
                </div>
            </div>
          </div>
          <div className="col-md-4">
            <span className="fw-semibold mb-1 d-block">
              Subscription Status
            </span>
            {isLoading ? (
              <Skeleton width={100} />
            ) : (
              <div>{formData.subscription_status || "N/A"}</div>
            )}
          </div>
          <div className="col-md-4">
            <span className="fw-semibold mb-1 d-block">Billing Cycle</span>
            {isLoading ? (
              <Skeleton width={200} />
            ) : (
              <div>Next payment on Dec 25, 2024</div>
            )}
          </div>
          <div className="col-md-4">
            <span className="fw-semibold mb-1 d-block">Payment Method</span>
            {isLoading ? (
              <Skeleton width={100} />
            ) : (
              <div>Visa ending in 1234</div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4 gap-2">
          <button type="button" className="btn-setting">
            Upgrade Plan
          </button>
          <button type="button" className="btn-setting">
            View Billing History
          </button>
          <button type="button" className="btn-setting">
            Update Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
