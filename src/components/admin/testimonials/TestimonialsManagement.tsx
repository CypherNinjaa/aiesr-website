"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTestimonials, useTestimonialActions } from "@/hooks/useTestimonials";
import { DatabaseTestimonial } from "@/types";

// Status badges
const statusBadges = {
  pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", class: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", class: "bg-red-100 text-red-800" },
};

interface TestimonialRowProps {
  testimonial: DatabaseTestimonial;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onToggleFeatured: (id: string) => void;
  onDelete: (id: string) => void;
}

const TestimonialRow: React.FC<TestimonialRowProps> = ({
  testimonial,
  onApprove,
  onReject,
  onToggleFeatured,
  onDelete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showFullStory, setShowFullStory] = useState(false);

  const statusBadge = statusBadges[testimonial.status];

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(testimonial.id);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      // Show error state instead of alert
      return;
    }
    setIsProcessing(true);
    try {
      await onReject(testimonial.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsProcessing(true);
    try {
      await onToggleFeatured(testimonial.id);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      await onDelete(testimonial.id);
      setShowDeleteModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="mr-3 text-2xl">👤</div>
            <div>
              <div className="text-sm font-medium text-gray-900">{testimonial.student_name}</div>
              <div className="text-sm text-gray-500">
                {testimonial.current_position && (
                  <>
                    {testimonial.current_position}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </>
                )}
              </div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {showFullStory ? testimonial.story_text : truncateText(testimonial.story_text)}
            {testimonial.story_text.length > 150 && (
              <button
                onClick={() => setShowFullStory(!showFullStory)}
                className="ml-2 text-xs text-blue-600 hover:text-blue-800"
              >
                {showFullStory ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{testimonial.academic_program || "N/A"}</div>
          <div className="text-sm text-gray-500">
            {testimonial.graduation_year && `Class of ${testimonial.graduation_year}`}
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge.class}`}
          >
            {statusBadge.label}
          </span>
          {testimonial.is_featured && (
            <span className="bg-gold ml-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">
            {new Date(testimonial.submitted_at).toLocaleDateString()}
          </div>
        </td>

        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
          <div className="flex space-x-2">
            {testimonial.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowRejectModal(true)}
                  disabled={isProcessing}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Reject
                </Button>
              </>
            )}

            {testimonial.status === "approved" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleFeatured}
                disabled={isProcessing}
                className={testimonial.is_featured ? "bg-gold text-white" : ""}
              >
                {testimonial.is_featured ? "Unfeature" : "Feature"}
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={isProcessing}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </td>
      </tr>

      {/* Reject Modal */}
      {showRejectModal && (
        <tr>
          <td colSpan={6}>
            <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600">
              <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
                <div className="mt-3">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Reject Testimonial</h3>
                  <div className="mb-4">
                    <label
                      htmlFor="reject-reason"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Reason for rejection:
                    </label>
                    <textarea
                      id="reject-reason"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                      placeholder="Please provide a reason for rejection..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectReason("");
                      }}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={isProcessing || !rejectReason.trim()}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {isProcessing ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <tr>
          <td colSpan={6}>
            <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600">
              <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
                <div className="mt-3">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Delete Testimonial</h3>
                  <p className="mb-6 text-gray-600">
                    Are you sure you want to delete this testimonial? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteModal(false)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDelete}
                      disabled={isProcessing}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {isProcessing ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export const TestimonialsManagement: React.FC = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: testimonialsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useTestimonials({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const { approveTestimonial, rejectTestimonial, toggleFeatured, deleteTestimonial } =
    useTestimonialActions();

  const handleRefresh = () => {
    refetch();
    showInfo("Refreshing Data", "Loading latest testimonials...", 2000);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveTestimonial.mutateAsync(id);
      showSuccess("Testimonial Approved", "The testimonial has been approved successfully.", 3000);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to approve testimonial";
      showError("Approval Failed", errorMessage, 5000);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectTestimonial.mutateAsync({ id, reason });
      showSuccess("Testimonial Rejected", "The testimonial has been rejected.", 3000);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject testimonial";
      showError("Rejection Failed", errorMessage, 5000);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleFeatured.mutateAsync(id);
      showSuccess(
        "Featured Status Updated",
        "The testimonial featured status has been updated.",
        3000
      );
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update featured status";
      showError("Update Failed", errorMessage, 5000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial.mutateAsync(id);
      showSuccess("Testimonial Deleted", "The testimonial has been deleted successfully.", 3000);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete testimonial";
      showError("Delete Failed", errorMessage, 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-burgundy h-32 w-32 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">Error loading testimonials: {error.message}</p>
        <RefreshButton
          onRefresh={handleRefresh}
          isLoading={isLoading}
          isFetching={isFetching}
          variant="primary"
          label="Retry"
          className="mt-2"
        />
      </div>
    );
  }
  const testimonials = testimonialsData?.data || [];
  const totalCount = testimonialsData?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📝</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Total</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">⏳</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Pending</dt>
                  <dd className="text-lg font-medium text-yellow-600">
                    {testimonials.filter(t => t.status === "pending").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Approved</dt>
                  <dd className="text-lg font-medium text-green-600">
                    {testimonials.filter(t => t.status === "approved").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">⭐</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Featured</dt>
                  <dd className="text-gold text-lg font-medium">
                    {testimonials.filter(t => t.is_featured).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              title="Filter testimonials by status"
              onChange={e => {
                setStatusFilter(e.target.value as "all" | "pending" | "approved" | "rejected");
                setCurrentPage(1);
              }}
              className="focus:ring-burgundy focus:border-burgundy rounded-md border border-gray-300 px-3 py-2 focus:ring-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <RefreshButton
              onRefresh={handleRefresh}
              isLoading={isLoading}
              isFetching={isFetching}
              variant="outline"
              size="md"
              label="Refresh"
            />
          </div>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Story
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {testimonials.map(testimonial => (
              <TestimonialRow
                key={testimonial.id}
                testimonial={testimonial}
                onApprove={handleApprove}
                onReject={handleReject}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        {testimonials.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No testimonials found</h3>
            <p className="text-gray-500">
              {statusFilter === "all"
                ? "No testimonials have been submitted yet."
                : `No ${statusFilter} testimonials found.`}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span>{" "}
                of <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="rounded-l-md"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    className="rounded-none"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="rounded-r-md"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
