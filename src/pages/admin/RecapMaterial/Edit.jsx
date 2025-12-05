import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateRecapMaterial, fetchRecapMaterials } from '../../../redux/slices/super_admin/RecapMaterial';
import { fetchCohorts } from '../../../redux/slices/cohortSlice';
import { toast, ToastContainer } from 'react-toastify';
import './RecapMaterial.css';

const RecapMaterialEdit = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { slug } = useParams();
	const { cohorts } = useSelector((state) => state.cohorts);
	const { recapMaterials, loading } = useSelector((state) => state.recapMaterials);
	const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
	const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    
	const [formData, setFormData] = useState({
		cohort_id: '',
		title: '',
		description: '',
		file_path: '',
		file_public_id: '',
	});
	const [errors, setErrors] = useState({});
	const [filePreview, setFilePreview] = useState(null);
	const [initialLoaded, setInitialLoaded] = useState(false);
	const [showSkeleton, setShowSkeleton] = useState(true);

	useEffect(() => {
		dispatch(fetchCohorts());
		dispatch(fetchRecapMaterials());
	}, [dispatch]);

	useEffect(() => {
		if (!initialLoaded && recapMaterials.length > 0) {
			const material = recapMaterials.find((m) => m.slug === slug);
			if (material) {
				setFormData({
					cohort_id: material.cohort_id || '',
					title: material.title || '',
					description: material.description || '',
					file_path: '', // Only set if uploading new file
					file_public_id: material.file_public_id || '',
				});
				setFilePreview(material.file_path || null);
				setInitialLoaded(true);
				setShowSkeleton(false);
			}
		}
	}, [recapMaterials, slug, initialLoaded]);

	const uploadVideoToCloudinary = async (file) => {
		const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
		const data = new FormData();
		data.append('file', file);
		data.append('upload_preset', uploadPreset);
		data.append('folder', 'recap_videos');
		const res = await fetch(url, {
			method: 'POST',
			body: data,
		});
		if (!res.ok) {
			throw new Error('Cloudinary upload failed');
		}
		return res.json();
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const MAX_SIZE_BYTES = 100 * 1024 * 1024;
			if (file.size > MAX_SIZE_BYTES) {
				setErrors(prev => ({ ...prev, file_path: 'File must be at most 100MB' }));
				setFormData(prev => ({ ...prev, file_path: null }));
				setFilePreview(null);
				return;
			}
			const allowedTypes = [
				'video/mp4',
				'video/quicktime',
				'video/x-matroska',
				'video/x-msvideo',
				'video/x-ms-wmv',
			];
			if (!allowedTypes.includes(file.type)) {
				setErrors(prev => ({ ...prev, file_path: 'File must be a video (mp4, mov, avi, mkv, wmv)' }));
				setFormData(prev => ({ ...prev, file_path: null }));
				setFilePreview(null);
				return;
			}
			setFormData(prev => ({ ...prev, file_path: file }));
			setFilePreview(file.name);
			setErrors(prev => ({ ...prev, file_path: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.cohort_id.trim()) {
			newErrors.cohort_id = 'Cohort is required';
		}
		if (!formData.title.trim()) {
			newErrors.title = 'Title is required';
		} else if (formData.title.length > 255) {
			newErrors.title = 'Title must be at most 255 characters';
		}
		if (formData.file_path && typeof formData.file_path !== 'string') {
			const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/wmv'];
			if (!allowedTypes.includes(formData.file_path.type)) {
				newErrors.file_path = 'File must be a video (mp4, mov, avi, mkv, wmv)';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		try {
			let cloudinaryResult = null;
			let fileUrl = filePreview;
			let filePublicId = formData.file_public_id;
			if (formData.file_path && typeof formData.file_path !== 'string') {
				cloudinaryResult = await uploadVideoToCloudinary(formData.file_path);
				fileUrl = cloudinaryResult?.secure_url || '';
				filePublicId = cloudinaryResult?.public_id || '';
			}
			const payload = {
				cohort_id: formData.cohort_id,
				title: formData.title,
				description: formData.description,
				file_path: fileUrl,
				file_public_id: filePublicId,
			};
			await dispatch(updateRecapMaterial({ slug, recapMaterialData: payload })).unwrap();
			toast.success('Recap material updated successfully!');
			setTimeout(() => {
				navigate('/admin/class-recap-materials');
			}, 300);
		} catch (error) {
			console.error(error);
			toast.error(error?.data?.message || 'Failed to update recap material');
		}
	};

	const handleCancel = () => {
		navigate('/admin/class-recap-materials');
	};

	if (showSkeleton) {
		return (
			<div className="recap-form-container">
				<Skeleton height={50} width={300} style={{ marginBottom: 20 }} />
				<Skeleton height={30} width={200} style={{ marginBottom: 10 }} />
				<Skeleton height={40} width={400} style={{ marginBottom: 10 }} />
				<Skeleton height={80} width={400} style={{ marginBottom: 10 }} />
				<Skeleton height={30} width={200} style={{ marginBottom: 10 }} />
				<Skeleton height={180} width={320} style={{ marginBottom: 10 }} />
				<Skeleton height={40} width={200} style={{ marginBottom: 10 }} />
			</div>
		);
	}
	return (
		<>
			<ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
			<div className="recap-form-container">
				<div className="recap-form-header">
					<div>
						<h1>Edit Recap Material</h1>
						<p>Update recap material for a cohort</p>
					</div>
					<button onClick={handleCancel} className="btn-secondary">Cancel</button>
				</div>
				<form onSubmit={handleSubmit} className="recap-form">
					<div className="form-section">
						<h2>Basic Information</h2>
						<div className="form-group">
							<label htmlFor="cohort_id">Cohort <span className="required">*</span></label>
							<select name="cohort_id" id="cohort_id" value={formData.cohort_id} onChange={handleChange}>
								<option value="">Select a Cohort</option>
								{cohorts.map(cohort => (
									<option key={cohort.id} value={cohort.id}>{cohort.name || cohort.title || `Cohort ${cohort.id}`}</option>
								))}
							</select>
							{errors.cohort_id && <span className="error-message">{errors.cohort_id}</span>}
						</div>
						<div className="form-group">
							<label htmlFor="title">Title <span className="required">*</span></label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="Enter title"
								className={errors.title ? 'error' : ''}
							/>
							{errors.title && <span className="error-message">{errors.title}</span>}
						</div>
						<div className="form-group">
							<label htmlFor="description">Description</label>
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Enter description (optional)"
								rows="3"
							/>
						</div>
					</div>
					<div className="form-section">
						<h2>Upload Video</h2>
						<div className="form-group">
							<label htmlFor="file_path">Video File</label>
							<input
								type="file"
								id="file_path"
								name="file_path"
								onChange={handleFileChange}
								accept=".mp4,.mov,.avi,.mkv,.wmv"
							/>
							{filePreview && typeof filePreview === 'string' && filePreview.startsWith('http') && (
								<div className="video-preview">
									<video width="320" height="180" controls>
										<source src={filePreview} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								</div>
							)}
							{filePreview && typeof filePreview === 'string' && !filePreview.startsWith('http') && (
								<span className="file-preview">Selected: {filePreview}</span>
							)}
							{errors.file_path && <span className="error-message">{errors.file_path}</span>}
						</div>
					</div>
					<div className="form-actions">
						<button type="button" onClick={handleCancel} className="btn-secondary" disabled={loading}>Cancel</button>
						<button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Updating...' : 'Update Recap Material'}</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default RecapMaterialEdit;
